const express = require('express');
const designService = require('../services/designService');
const logger = require('../utils/logger');
const { isValidObjectId } = require('../validators/objectIdValidator');
const { validateRequest } = require('../utils/validation');
const { handleServiceCall } = require('../utils/handleServiceCall');
const Joi = require('joi');
const router = express.Router();

// Joi validation schema for creating and updating designs
const designValidationSchema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().optional(),
    materials: Joi.array().items(Joi.string()).optional(),
    furniture: Joi.array().items(Joi.string()).optional(),
    layout: Joi.object().required(),
});

const createDesign = (req, res) => {
    const userId = req.user.id;
    try {
        validateRequest(designValidationSchema, req.body);
        handleServiceCall(designService.createDesign, res, userId, req.body);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getDesignById = (req, res) => {
    const designId = req.params.id;
    if (!isValidObjectId(designId)) return res.status(400).json({ message: "Invalid Design ID" });
    handleServiceCall(designService.getDesignById, res, designId);
};

const updateDesign = (req, res) => {
    const designId = req.params.id;
    if (!isValidObjectId(designId)) return res.status(400).json({ message: "Invalid Design ID" });

    try {
        validateRequest(designValidationSchema, req.body);
        handleServiceCall(designService.updateDesign, res, designId, req.body);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteDesign = (req, res) => {
    const designId = req.params.id;
    if (!isValidObjectId(designId)) return res.status(400).json({ message: "Invalid Design ID" });
    handleServiceCall(designService.deleteDesign, res, designId);
};

const getDesignRecommendations = (req, res) => {
    handleServiceCall(designService.getDesignRecommendations, res, req.params.id);
};

const getDesignsByUser = (req, res) => {
    const userId = req.user.id;
    handleServiceCall(designService.getDesignsByUser, res, userId);
};

module.exports = {
    createDesign,
    getDesignById,
    updateDesign,
    deleteDesign,
    getDesignRecommendations,
    getDesignsByUser
};
