const express = require('express');
const furnitureService = require('../services/furnitureService');
const { isValidObjectId } = require('../validators/objectIdValidator');
const { validateRequest } = require('../utils/validateRequest');
const { handleServiceCall } = require('../utils/handleServiceCall');
const Joi = require('joi');
const logger = require('../utils/logger');
const router = express.Router();

// Updated Joi validation schema aligned with the Furniture model field names
const furnitureValidationSchema = Joi.object({
    FurnitureName: Joi.string().min(3).required(),
    FurnitureCategoryID: Joi.string().required(),
    FurnitureColorID: Joi.string().required(),
    FurnitureWidth: Joi.number().required(),
    FurnitureHeight: Joi.number().required(),
    FurnitureDepth: Joi.number().required(),
    FurniturePrice: Joi.number().min(0).required(),
    FurnitureMaterialID: Joi.string().required(),
    StoreID: Joi.string().required(),
    RoomTypeID: Joi.string().required(),
    FurniturePicture: Joi.string().uri().optional().allow(null)
});

// Controller function to add furniture
const addFurniture = (req, res) => {
    try {
        validateRequest(req, res, () => {}, furnitureValidationSchema);
        handleServiceCall(furnitureService.addFurniture, res, req.body);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller function to get furniture by ID
const getFurnitureById = (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid furniture ID' });
    handleServiceCall(furnitureService.getFurnitureById, res, id);
};

// Controller function to get all furniture
const getAllFurniture = (req, res) => {
    handleServiceCall(furnitureService.getAllFurniture, res);
};

// Controller function to update furniture by ID
const updateFurniture = (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid furniture ID' });
    try {
        validateRequest(req, res, () => {}, furnitureValidationSchema);
        handleServiceCall(furnitureService.updateFurniture, res, id, req.body);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller function to delete furniture by ID
const deleteFurniture = (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid furniture ID' });
    handleServiceCall(furnitureService.deleteFurniture, res, id);
};

// Controller function to get furniture by category
const getFurnitureByCategory = (req, res) => {
    const { category } = req.params;
    handleServiceCall(furnitureService.getFurnitureByCategory, res, category);
};

// Controller function to get furniture by color
const getFurnitureByColor = (req, res) => {
    const { color } = req.params;
    handleServiceCall(furnitureService.getFurnitureByColor, res, color);
};

// Controller function to get furniture by material
const getFurnitureByMaterial = (req, res) => {
    const { material } = req.params;
    handleServiceCall(furnitureService.getFurnitureByMaterial, res, material);
};

// New controller function: Get store inventory by store ID
const getStoreInventory = (req, res) => {
    const { storeId } = req.params;
    if (!isValidObjectId(storeId)) return res.status(400).json({ message: 'Invalid store ID' });
    handleServiceCall(furnitureService.getStoreInventory, res, storeId);
};

module.exports = {
    addFurniture,
    getFurnitureById,
    getAllFurniture,
    updateFurniture,
    deleteFurniture,
    getFurnitureByCategory,
    getFurnitureByColor,
    getFurnitureByMaterial,
    getStoreInventory
};
