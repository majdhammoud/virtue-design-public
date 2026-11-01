/**
 * Retrieves the JWT token from localStorage.
 * @returns {string|null} The JWT token, or null if not found.
 */
const getToken = () => {
  return localStorage.getItem("token"); 
};

/**
 * Retrieves the JWT token from localStorage and formats it as a Bearer token.
 * @returns {string} The Bearer token string, or an empty string if token not found.
 */
const getTokenBearer = () => {
  const token = getToken();
  console.log("Retrieved Token:", token);
  return token ? `Bearer ${token}` : "";
};

module.exports = {
  getToken,
  getTokenBearer,
};
