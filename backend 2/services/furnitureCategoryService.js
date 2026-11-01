const FurnitureCategory = require('../models/furnitureCategory');
const { isValidObjectId } = require('../validators/objectIdValidator');
const logger = require('../utils/logger');

const createCategory = async (categoryData) => {
    try {
        console.log(categoryData);
        const result = await FurnitureCategory.create(categoryData);
        logger.info(`Furniture category created successfully: ${result._id}`);
        return result;
    } catch (error) {
        logger.error('Error creating furniture category: ' + error.message);
        throw new Error('Error creating furniture category: ' + error.message);
    }
};

const getCategoryById = async (id) => {
    if (!isValidObjectId(id)) {
        throw new Error('Invalid category ID');
    }
    try {
        const result = await FurnitureCategory.findById(id);
        if (!result) {
            throw new Error('Category not found');
        }
        logger.info(`Furniture category retrieved successfully: ${id}`);
        return result;
    } catch (error) {
        logger.error('Error retrieving furniture category: ' + error.message);
        throw new Error('Error retrieving furniture category: ' + error.message);
    }
};

const getAllCategories = async () => {
    try {
        const result = await FurnitureCategory.find();
        logger.info('All furniture categories retrieved successfully');
        return result;
    } catch (error) {
        logger.error('Error fetching all furniture categories: ' + error.message);
        throw new Error('Error fetching all furniture categories: ' + error.message);
    }
};

const updateCategory = async (id, categoryData) => {
    if (!isValidObjectId(id)) {
        throw new Error('Invalid category ID');
    }
    try {
        const result = await FurnitureCategory.findByIdAndUpdate(id, categoryData, { new: true });
        if (!result) {
            throw new Error('Category not found');
        }
        logger.info(`Furniture category updated successfully: ${id}`);
        return result;
    } catch (error) {
        logger.error('Error updating furniture category: ' + error.message);
        throw new Error('Error updating furniture category: ' + error.message);
    }
};

const deleteCategory = async (id) => {
    if (!isValidObjectId(id)) {
        throw new Error('Invalid category ID');
    }
    try {
        const result = await FurnitureCategory.findByIdAndDelete(id);
        if (!result) {
            throw new Error('Category not found');
        }
        logger.info(`Furniture category deleted successfully: ${id}`);
        return result;
    } catch (error) {
        logger.error('Error deleting furniture category: ' + error.message);
        throw new Error('Error deleting furniture category: ' + error.message);
    }
};

module.exports = {
    createCategory,
    getCategoryById,
    getAllCategories,
    updateCategory,
    deleteCategory
};