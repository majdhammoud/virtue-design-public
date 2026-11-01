import http from "../http-common";

/**
 * Fetch all furniture stores from the backend.
 * @returns {Promise<Array>} - Resolves with an array of store objects.
 * @throws {Error} - Throws error if request fails.
 */
export const getAllStores = async () => {
    try {
        const response = await http.get('/api/store');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || error.message);
    }
};

/**
 * Fetch a specific store by its ID.
 * @param {string} storeId - The ID of the store to fetch.
 * @returns {Promise<Object>} - Resolves with the store object.
 * @throws {Error} - Throws error if request fails.
 */
export const getStoreById = async (storeId) => {
    try {
        const response = await http.get(`/api/store/${storeId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || error.message);
    }
};

/**
 * Create a new store with the provided data.
 * @param {Object} storeData - The store data to create.
 * @returns {Promise<Object>} - Resolves with the created store object.
 * @throws {Error} - Throws error if request fails.
 */
export const createStore = async (storeData) => {
    try {
        const response = await http.post('/api/store', storeData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || error.message);
    }
};

/**
 * Update an existing store by its ID with new data.
 * @param {string} storeId - The ID of the store to update.
 * @param {Object} storeData - The new store data.
 * @returns {Promise<Object>} - Resolves with the updated store object.
 * @throws {Error} - Throws error if request fails.
 */
export const updateStore = async (storeId, storeData) => {
    try {
        const response = await http.put(`/api/store/${storeId}`, storeData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || error.message);
    }
};

/**
 * Delete a store by its ID.
 * @param {string} storeId - The ID of the store to delete.
 * @returns {Promise<Object>} - Resolves with a success message or deleted object.
 * @throws {Error} - Throws error if request fails.
 */
export const deleteStore = async (storeId) => {
    try {
        const response = await http.delete(`/api/store/${storeId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || error.message);
    }
};
