const express = require('express');
const router = express.Router();
const furnitureCategoryService = require('../services/furnitureCategoryService');
const { isValidObjectId } = require('../validators/objectIdValidator');
const Joi = require('joi');
const { validateRequest } = require('../utils/validateRequest');
const { handleServiceCall } = require('../utils/handleServiceCall');

// Joi schema for creating a category
const createCategorySchema = Joi.object({
    name: Joi.string().required(),
    roomType: Joi.string().required() // Expecting a valid ObjectId in string form
});

// Joi schema for updating a category
const updateCategorySchema = Joi.object({
    name: Joi.string().optional(),
    roomType: Joi.string().optional()
});

// Route to create a new category
router.post('/', async (req, res) => {
    try {
        const validatedBody = validateRequest(createCategorySchema, req.body);
        // Map validated fields to the model's fields
        const categoryData = {
            CategoryName: validatedBody.name,
            RoomType: validatedBody.roomType
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

// Route to update a category
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid category ID' });
    }
    try {
        const validatedBody = validateRequest(updateCategorySchema, req.body);
        // Map fields for update if provided
        const updateData = {};
        if (validatedBody.name) updateData.CategoryName = validatedBody.name;
        if (validatedBody.roomType) updateData.RoomType = validatedBody.roomType;
        await handleServiceCall(furnitureCategoryService.updateCategory, res, id, updateData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to delete a category
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid category ID' });
    }
    handleServiceCall(furnitureCategoryService.deleteCategory, res, id);
});

module.exports = router;