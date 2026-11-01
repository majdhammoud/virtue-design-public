const express = require('express');
const router = express.Router();
const { handleServiceCall } = require('../utils/handleServiceCall');
const furnitureCategoryService = require('../services/furnitureCategoryService');
const { isValidObjectId } = require('../validators/objectIdValidator');
const { createFurnitureCategorySchema, updateFurnitureCategorySchema } = require('../validators/furnitureCategoryValidator');
const { validateRequest } = require('../utils/validateRequest');
const requireAdmin = require('../middleware/authAdminMiddleware');
// Route to create a new furniture category
router.post('/', requireAdmin, async (req, res) => {
    try {
        // Validate and sanitize incoming data using our custom validator utility
        const validatedBody = validateRequest(req, res, () => {}, createFurnitureCategorySchema);
        // Map client-friendly fields to the model's fields
        const categoryData = {
            CategoryName: req.body.name,
            RoomType: req.body.roomType
        };
        await handleServiceCall(furnitureCategoryService.createCategory, res, categoryData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to get a category by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid category ID' });
    }
    handleServiceCall(furnitureCategoryService.getCategoryById, res, id);
});

// Route to get all categories
router.get('/', (req, res) => {
    handleServiceCall(furnitureCategoryService.getAllCategories, res);
});

// Route to update a furniture category
router.put('/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid category ID' });
    }
    try {
        const validatedBody = validateRequest(req, res, () => {}, createFurnitureCategorySchema);
        // Build the update object only with provided fields and map them to model's fields
        const updateData = {};
        if (req.body.name) updateData.CategoryName = req.body.name;
        if (req.body.roomType) updateData.RoomType = req.body.roomType;
        await handleServiceCall(furnitureCategoryService.updateCategory, res, id, updateData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to delete a furniture category
router.delete('/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid category ID' });
    }
    handleServiceCall(furnitureCategoryService.deleteCategory, res, id);
});

module.exports = router;