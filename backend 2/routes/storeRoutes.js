const express = require('express');
const router = express.Router();
const {addStoreController, getStoreIdByNameController, getStoresByLocationController, updateStoreController, deleteStoreController, getStoreNameByIdController, getAllStoresController} = require('../controllers/storeController');
const requireAdmin = require('../middleware/authAdminMiddleware');
// Route to add a new store
router.post('/add', requireAdmin, addStoreController);

// Route to get store by ID
router.get('/id/:storeId', getStoreNameByIdController);
router.get('/', getAllStoresController);

// Route to get store ID by name
router.get('/id/name/:storeName', getStoreIdByNameController);

// Route to get stores by location (geospatial query)
router.get('/location', getStoresByLocationController);

// Route to update a store
router.put('/:storeId', requireAdmin, updateStoreController);

// Route to delete a store
router.delete('/:storeId', requireAdmin, deleteStoreController);

module.exports = router;
