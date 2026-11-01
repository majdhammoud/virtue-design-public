import http from "../http-common";

/**
 * Sends a verification code to the user's email.
 * Used for email verification on signup.
 * @param {Object} params
 * @param {string} params.email - The user's email address
 * @returns {Promise<Object>} - Response data (typically success message)
 * @throws {Error} - If the API call fails
 */
export const sendVerificationCode = async ({ email }) => {
  console.log("Sending verification code request with email:", email, "Type:", typeof email);
  try {
    const response = await http.post('/api/auth/send-verification-code', { email });
    console.log("Server response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error response:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to send verification code");
  }
};

/**
 * Verifies the user's code received by email.
 * Used during signup/email verification step.
 * @param {string} email
 * @param {string} verificationCode
 * @returns {Promise<Object>} - Response data (typically success message)
 * @throws {Error} - If verification fails
 */
export const verifyUser = async (email, verificationCode) => {
  try {
    const response = await http.post('/api/auth/verify-user', { email, verificationCode });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

/**
 * Registers a new user with all required details.
 * @param {string} email
 * @param {string} username
 * @param {string} password
 * @param {string} confirmPassword
 * @param {number} latitude - User's geolocation latitude
 * @param {number} longitude - User's geolocation longitude
 * @returns {Promise<Object>} - Newly created user or success message
 * @throws {Error} - If registration fails
 */
export const registerUser = async (email, username, password, confirmPassword, latitude, longitude) => {
  try {
    const response = await http.post('/api/auth/register', {
      email,
      username,
      password,
      confirmPassword,
      UserLocationX: latitude,
      UserLocationY: longitude,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

/**
 * Logs in a user by username and password.
 * Returns JWT token if successful.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Object>} - Contains token and user info
 * @throws {Error} - If login fails
 */
export const loginUser = async (username, password) => {
  try {
    const response = await http.post('/api/auth/login', { username, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

/**
 * Completes a pending registration after email verification.
 * (If you split registration into separate steps)
 * @param {string} email
 * @param {string} username
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {Promise<Object>} - Success message
 * @throws {Error} - If completion fails
 */
export const completeRegistration = async (email, username, password, confirmPassword) => {
  try {
    const response = await http.post('/api/auth/complete-registration', {
      email,
      username,
      password,
      confirmPassword
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

/**
 * Starts forgot password flow. Sends a reset link or code to the email.
 * @param {string} email
 * @returns {Promise<Object>} - Success message
 * @throws {Error} - If the operation fails
 */
export const forgotPassword = async (email) => {
  try {
    const response = await http.post('/api/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

/**
 * Resets the user's password with the provided token and new password.
 * @param {string} resetToken
 * @param {string} newPassword
 * @returns {Promise<Object>} - Success message
 * @throws {Error} - If the reset fails
 */
export const resetPassword = async (resetToken, newPassword) => {
  try {
    const response = await http.post('/api/auth/reset-password', { resetToken, newPassword });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

/**
 * Checks if an email is already registered (used for instant validation in signup form).
 * @param {string} email
 * @returns {Promise<boolean>} - True if exists, else false
 * @throws {Error} - If the check fails
 */
export const checkEmailExists = async (email) => {
  try {
    const response = await http.post('/api/auth/check-email', { email });
    return response.data.exists;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

/**
 * Checks if a username is already taken.
 * @param {string} username
 * @returns {Promise<boolean>} - True if exists, else false
 * @throws {Error} - If the check fails
 */
export const checkUsernameExists = async (username) => {
  try {
    const response = await http.post('/api/auth/check-username', { username });
    return response.data.exists;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};
