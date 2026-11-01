const storeService = require('../services/storeService');
const { handleServiceCall } = require('../utils/handleServiceCall');
const { validateStore } = require('../validators/storeValidator'); // Import the validator
const logger = require('../utils/logger');

// Controller function to add a store
const addStoreController = async (req, res) => {
    try {
        // Validate request body using storeValidator
        const validatedData = validateStore(req.body);

        // Use handleServiceCall to manage service call and error handling
        await handleServiceCall(storeService.addStore, res, validatedData);
    } catch (error) {
        logger.error(`Error adding store: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

// Controller function to get store by ID
const getStoreNameByIdController = async (req, res) => {
    const { storeId } = req.params;
    try {
        await handleServiceCall(storeService.getStoreNameById, res, storeId);
    } catch (error) {
        logger.error(`Error retrieving store by ID: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

// Controller function to get store ID by name
const getStoreIdByNameController = async (req, res) => {
    const { storeName } = req.params;
    try {
        await handleServiceCall(storeService.getStoreIdByName, res, storeName);
    } catch (error) {
        logger.error(`Error retrieving store ID by name: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

// Controller function to get stores by location (geospatial)
const getStoresByLocationController = async (req, res) => {
    const { location } = req.query; // Assuming location is passed as a query parameter (e.g., ?location=[longitude,latitude])
    try {
        await handleServiceCall(storeService.getStoresByLocation, res, location);
    } catch (error) {
        logger.error(`Error retrieving stores by location: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

// Controller function to update a store's details
const updateStoreController = async (req, res) => {
    const { storeId } = req.params;
    try {
        const validatedData = validateStore(req.body); // Validate updated store data

        await handleServiceCall(storeService.updateStore, res, storeId, validatedData);
    } catch (error) {
        logger.error(`Error updating store: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

// Controller function to delete a store
const deleteStoreController = async (req, res) => {
    const { storeId } = req.params;
    try {
        await handleServiceCall(storeService.deleteStore, res, storeId);
    } catch (error) {
        logger.error(`Error deleting store: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

// Controller function to get all stores
const getAllStoresController = async (req, res) => {
    try {
        await handleServiceCall(storeService.getAllStores, res);
    } catch (error) {
        logger.error(`Error retrieving all stores: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    addStoreController,
    getStoreNameByIdController,
    getStoreIdByNameController,
    getStoresByLocationController,
    updateStoreController,
    deleteStoreController,
    getAllStoresController
};
