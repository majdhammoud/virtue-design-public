const FurnitureColor = require('../models/furnitureColors'); 
const logger = require('../utils/logger');
const { isValidObjectId } = require('../validators/objectIdValidator');

const addColor = async (colorData) => {
    try {
        const color = await FurnitureColor.create(colorData);
        logger.info('Color added successfully');
        return color;
    } catch (error) {
        logger.error('Error adding color: ' + error.message);
        throw new Error('Error adding color: ' + error.message);
    }
};

const getColorById = async (id) => {
    if (!isValidObjectId(id)) throw new Error('Invalid color ID');
    try {
        const color = await FurnitureColor.findById(id);
        if (!color) throw new Error('Color not found');
        logger.info('Color retrieved successfully');
        return color;
    } catch (error) {
        logger.error('Error retrieving color by ID: ' + error.message);
        throw new Error('Error retrieving color by ID: ' + error.message);
    }
};

const getAllColors = async () => {
    try {
        const colors = await FurnitureColor.find();
        logger.info('All colors retrieved successfully');
        return colors;
    } catch (error) {
        logger.error('Error fetching all colors: ' + error.message);
        throw new Error('Error fetching all colors: ' + error.message);
    }
};

const updateColor = async (id, colorData) => {
    if (!isValidObjectId(id)) throw new Error('Invalid color ID');
    try {
        const color = await FurnitureColor.findByIdAndUpdate(id, colorData, { new: true });
        if (!color) throw new Error('Color not found');
        logger.info('Color updated successfully');
        return color;
    } catch (error) {
        logger.error('Error updating color: ' + error.message);
        throw new Error('Error updating color: ' + error.message);
    }
};

const deleteColor = async (id) => {
    if (!isValidObjectId(id)) throw new Error('Invalid color ID');
    try {
        const color = await FurnitureColor.findByIdAndDelete(id);
        if (!color) throw new Error('Color not found');
        logger.info('Color deleted successfully');
        return true;
    } catch (error) {
        logger.error('Error deleting color: ' + error.message);
        throw new Error('Error deleting color: ' + error.message);
    }
};

module.exports = {
    addColor,
    getColorById,
    getAllColors,
    updateColor,
    deleteColor
};
