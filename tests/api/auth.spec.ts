import { test, expect, APIRequestContext } from "@playwright/test";

// Helper function to register a user
async function registerUser(
  request: APIRequestContext,
  email: string,
  name: string,
  password: string,
) {
  const signupData = { name, email, password };
  const response = await request.post("/api/auth/signup", { data: signupData });
  return response;
}

// Authentication API tests

test.describe("Authentication API", () => {
  test("Signup - should return 400 if missing required fields", async ({
    request,
  }) => {
    const response = await request.post("/api/auth/signup", {
      data: { name: "", email: "", password: "" },
    });
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty("error", "Missing required fields");
  });

  test("Signup - should register a new user successfully", async ({
    request,
  }) => {
    const uniqueEmail = `user_${Date.now()}@example.com`;
    const signupData = {
      name: "Test User",
      email: uniqueEmail,
      password: "password123",
    };

    const response = await request.post("/api/auth/signup", {
      data: signupData,
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.user).toHaveProperty("id");
    expect(data.user).toHaveProperty("name", "Test User");
    expect(data.user).toHaveProperty("email", uniqueEmail);
  });

  test("Login - should return 404 for non-existent user", async ({
    request,
  }) => {
    const response = await request.post("/api/auth/login", {
      data: { email: "nonexistent@example.com", password: "password" },
    });
    expect(response.status()).toBe(404);
    const data = await response.json();
    expect(data).toHaveProperty("error", "User not found");
  });

  test("Login - should return 401 for invalid credentials", async ({
    request,
  }) => {
    const uniqueEmail = `user_invalid_${Date.now()}@example.com`;
    // Register a new user first
    await registerUser(
      request,
      uniqueEmail,
      "Invalid Test User",
      "validpassword",
    );

    // Attempt login with incorrect password
    const response = await request.post("/api/auth/login", {
      data: { email: uniqueEmail, password: "wrongpassword" },
    });
    expect(response.status()).toBe(401);
    const data = await response.json();
    expect(data).toHaveProperty("error", "Invalid credentials");
  });

  test("Login - should authenticate successfully with valid credentials", async ({
    request,
  }) => {
    const uniqueEmail = `user_success_${Date.now()}@example.com`;
    const password = "password123";
    // Register a new user
    await registerUser(request, uniqueEmail, "Successful Test User", password);

    // Attempt login with correct credentials
    const response = await request.post("/api/auth/login", {
      data: { email: uniqueEmail, password },
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.message).toBe("User logged in successfully");
    expect(data.user).toHaveProperty("email", uniqueEmail);
  });
});
