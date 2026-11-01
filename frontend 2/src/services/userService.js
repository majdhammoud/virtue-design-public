import http from "../http-common";

/**
 * Get user information by username.
 * @param {string} username - Username to look up.
 * @returns {Promise<Object>} - Resolves with user object.
 * @throws {Error} - Throws error if request fails.
 */
export const getUserByUsername = async (username) => {
  try {
    const response = await http.get(`/api/user/username/${username}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

/**
 * Get user information by email.
 * @param {string} email - User's email address.
 * @returns {Promise<Object>} - Resolves with user object.
 * @throws {Error} - Throws error if request fails.
 */
export const getUserByEmail = async (email) => {
  try {
    const response = await http.get(`/api/user/email/${email}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

/**
 * Get user ID by username.
 * @param {string} username - Username to look up.
 * @returns {Promise<string>} - Resolves with user ID.
 * @throws {Error} - Throws error if request fails.
 */
export const getUserIdByUsername = async (username) => {
  try {
    const response = await http.get(`/api/user/id/username/${username}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

/**
 * Get username by user ID.
 * @param {string} userId - User ID to look up.
 * @returns {Promise<string>} - Resolves with username.
 * @throws {Error} - Throws error if request fails.
 */
export const getUsernameByUserId = async (userId) => {
  try {
    const response = await http.get(`/api/user/username/id/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

/**
 * Update user preferences.
 * @param {string} username - Username to update preferences for.
 * @param {Object} preferences - Preferences object to update.
 * @returns {Promise<Object>} - Resolves with updated preferences.
 * @throws {Error} - Throws error if request fails.
 */
export const updateUserPreferences = async (username, preferences) => {
  try {
    const response = await http.post(`/api/user/preferences`, preferences);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

/**
 * Get user preferences by username.
 * @param {string} username - Username to fetch preferences for.
 * @returns {Promise<Object>} - Resolves with user preferences object.
 * @throws {Error} - Throws error if request fails.
 */
export const getUserPreferences = async (username) => {
  try {
    const response = await http.get(`/api/user/preferences`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

/**
 * Get recommended designs for user.
 * @param {string} username - Username to recommend designs for.
 * @returns {Promise<Array>} - Resolves with array of design objects.
 * @throws {Error} - Throws error if request fails.
 */
export const recommendDesigns = async (username) => {
  try {
    const response = await http.get(`/api/designs`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

/**
 * Search for generated designs.
 * @returns {Promise<Array>} - Resolves with array of found design objects.
 * @throws {Error} - Throws error if request fails.
 */
export const searchGeneratedDesigns = async () => {
  try {
    const response = await http.get(`/api/designs/search`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

/**
 * Get user join date by username.
 * @param {string} username - Username to look up join date for.
 * @returns {Promise<string>} - Resolves with join date (ISO string or date).
 * @throws {Error} - Throws error if request fails.
 */
export const getUserJoinDateByUsername = async (username) => {
  try {
    const response = await http.get(`/api/user/join-date/${username}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};
