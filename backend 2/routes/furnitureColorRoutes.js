const express = require('express');
const router = express.Router();
const furnitureColorController = require('../controllers/furnitureColorController');
const { validateFurnitureColor, validateFurnitureColorId } = require('../validators/furnitureColorValidator');
const requireAdmin = require('../middleware/authAdminMiddleware');

// Route for adding a new color
router.post('/', requireAdmin, validateFurnitureColor, furnitureColorController.addColor);

// Route for retrieving all colors
router.get('/', furnitureColorController.getAllColors);

// Route for retrieving a color by its ID
router.get('/:id', validateFurnitureColorId, furnitureColorController.getColorById);

// Route for updating a color by its ID
router.put('/:id', requireAdmin, validateFurnitureColorId, validateFurnitureColor, furnitureColorController.updateColor);

// Route for deleting a color by its ID
router.delete('/:id', requireAdmin, validateFurnitureColorId, furnitureColorController.deleteColor);

module.exports = router;
