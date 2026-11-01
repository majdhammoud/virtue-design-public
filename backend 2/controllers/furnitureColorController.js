const express = require('express');
const furnitureColorService = require('../services/furnitureColorService');
const { isValidObjectId } = require('../validators/objectIdValidator');
const { validateRequest } = require('../utils/validateRequest');
const { handleServiceCall } = require('../utils/handleServiceCall');
const Joi = require('joi');
const logger = require('../utils/logger');
const router = express.Router();

// Updated Joi validation schema aligned with the model fields
const colorValidationSchema = Joi.object({
    ColorName: Joi.string().min(3).required(),
    ColorTone: Joi.string()
        .valid('Neutral', 'Bold', 'Pastel', 'Monochromatic', 'Earthy', 'Vibrant')
        .required(),
});

// Controller function to add a color
const addColor = (req, res) => {
    try {
        validateRequest(req, res, () => {}, colorValidationSchema);
        handleServiceCall(furnitureColorService.addColor, res, req.body);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller function to get a color by ID
const getColorById = (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid color ID' });
    handleServiceCall(furnitureColorService.getColorById, res, id);
};

// Controller function to get all colors
const getAllColors = (req, res) => {
    handleServiceCall(furnitureColorService.getAllColors, res);
};

// Controller function to update a color by ID
const updateColor = (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid color ID' });
    try {
        validateRequest(req, res, () => {}, colorValidationSchema);
        handleServiceCall(furnitureColorService.updateColor, res, id, req.body);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller function to delete a color by ID
const deleteColor = (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid color ID' });
    handleServiceCall(furnitureColorService.deleteColor, res, id);
};

module.exports = {
    addColor,
    getColorById,
    getAllColors,
    updateColor,
    deleteColor
};
