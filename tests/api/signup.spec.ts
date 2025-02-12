import { test, expect } from "@playwright/test";

test.describe("Signup API Endpoint", () => {
  test("should successfully create a new user when given valid data", async ({
    request,
  }) => {
    // Use a unique value in the email to avoid duplication
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    const signupData = {
      name: "Test User",
      email: uniqueEmail,
      password: "StrongPassword123!",
    };

    // Send a POST request to the signup endpoint
    const response = await request.post("/api/auth/signup", {
      data: signupData,
    });

    // Verify the response status is 200, indicating successful registration
    expect(response.status()).toBe(200);

    // Parse the JSON response
    const responseData = await response.json();

    // Validate the response structure and data
    expect(responseData).toMatchObject({
      success: true,
      message: "User registered successfully",
    });
    expect(responseData.user).toMatchObject({
      name: signupData.name,
      email: signupData.email,
    });
    expect(responseData.user).toHaveProperty("id");
    expect(responseData.user).toHaveProperty("created_at");
  });

  test("should return an error when required fields are missing", async ({
    request,
  }) => {
    const invalidData = {
      email: "testuser@example.com",
      password: "StrongPassword123",
    };

    // Send request without required field
    const response = await request.post("/api/auth/signup", {
      data: invalidData,
    });

    // Expect a 400 status code for a bad request
    expect(response.status()).toBe(400);

    const responseData = await response.json();
    expect(responseData).toEqual({
      error: "Missing required fields",
    });
  });
});
