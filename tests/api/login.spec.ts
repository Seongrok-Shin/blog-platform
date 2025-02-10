import { test, expect, APIRequestContext } from "@playwright/test";

// Helper function to create a test user via the signup endpoint
async function createTestUser(
  request: APIRequestContext,
  email: string,
  password: string,
) {
  const signupData = {
    name: "Test User",
    email,
    password,
  };
  const signupResponse = await request.post("/api/auth/signup", {
    data: signupData,
  });
  expect(signupResponse.status()).toBe(200);
}

test.describe("Login API Endpoint", () => {
  test("should return 400 if missing email or password", async ({
    request,
  }) => {
    const response = await request.post("/api/auth/login", {
      data: { email: "", password: "" },
    });
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty("error", "Missing email or password");
  });

  test("should return 404 for non-existent user", async ({ request }) => {
    const response = await request.post("/api/auth/login", {
      data: { email: "nonexistent@example.com", password: "password" },
    });
    expect(response.status()).toBe(404);
    const data = await response.json();
    expect(data).toHaveProperty("error", "User not found");
  });

  test("should return 401 for invalid credentials", async ({ request }) => {
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    // Create a new user first
    await createTestUser(request, uniqueEmail, "password123");

    // Now attempt login with wrong password
    const response = await request.post("/api/auth/login", {
      data: { email: uniqueEmail, password: "wrongpassword" },
    });
    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data).toHaveProperty("error", "Invalid credentials");
  });

  test("should login successfully with valid credentials", async ({
    request,
  }) => {
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    // Create a new user first
    await createTestUser(request, uniqueEmail, "password123");

    // Now login with the correct credentials
    const response = await request.post("/api/auth/login", {
      data: { email: uniqueEmail, password: "password123" },
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toMatchObject({
      success: true,
      message: "User logged in successfully",
    });
    expect(data.user).toMatchObject({
      email: uniqueEmail,
    });
  });
});
