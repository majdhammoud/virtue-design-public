const express = require('express');
const router = express.Router();
const furnitureController = require('../controllers/furnitureController');
const requireAdmin = require('../middleware/authAdminMiddleware');
// Route for creating new furniture
router.post('/', requireAdmin, furnitureController.addFurniture);

// Route for retrieving all furniture
router.get('/', furnitureController.getAllFurniture);

// Routes for filtering furniture
router.get('/by-category/:category', furnitureController.getFurnitureByCategory);
router.get('/by-color/:color', furnitureController.getFurnitureByColor);
router.get('/by-material/:material', furnitureController.getFurnitureByMaterial);

// Route for getting store inventory (furniture items associated with a store)
router.get('/store/:storeId/inventory', furnitureController.getStoreInventory);

// Routes for operations by furniture ID
router.get('/:id', furnitureController.getFurnitureById);
router.put('/:id', requireAdmin, furnitureController.updateFurniture);
router.delete('/:id', requireAdmin, furnitureController.deleteFurniture);

module.exports = router;
