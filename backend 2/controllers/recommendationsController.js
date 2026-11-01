const express = require('express');
const recommendationService = require('../services/recommendationService');
const { isValidObjectId } = require('../validators/objectIdValidator');
const logger = require('../utils/logger');
const Joi = require('joi');
const { handleServiceCall } = require('../utils/handleServiceCall'); // Import the generic service handler
const { validateRequest } = require('../utils/validateRequest'); // Import validation helper

const router = express.Router();

// Joi validation schema for recommendation data
const recommendationSchema = Joi.object({
    user: Joi.string().required(),
    item: Joi.string().required(),
    reason: Joi.string().optional(),
});

// Controller function to create recommendation
const createRecommendation = async (req, res) => {
    try {
        // Validate request body using the validateRequest helper
        const validatedData = validateRequest(recommendationSchema, req.body);
        
        // Use handleServiceCall to manage service call and error handling
        await handleServiceCall(recommendationService.createRecommendation, res, validatedData);
    } catch (error) {
        logger.error(`Error creating recommendation: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

// Controller function to get recommendation by ID
const getRecommendationById = async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid recommendation ID' });
    }

    try {
        await handleServiceCall(recommendationService.getRecommendationById, res, id);
    } catch (error) {
        logger.error(`Error fetching recommendation: ${error.message}`);
        res.status(404).json({ message: error.message });
    }
};

// Controller function to get all recommendations
const getAllRecommendations = async (req, res) => {
    try {
        await handleServiceCall(recommendationService.getAllRecommendations, res);
    } catch (error) {
        logger.error(`Error fetching recommendations: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

// Controller function to update recommendation
const updateRecommendation = async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid recommendation ID' });
    }

    try {
        // Validate request body using the validateRequest helper
        const validatedData = validateRequest(recommendationSchema, req.body);

        // Use handleServiceCall to manage service call and error handling
        await handleServiceCall(recommendationService.updateRecommendation, res, id, validatedData);
    } catch (error) {
        logger.error(`Error updating recommendation: ${error.message}`);
        res.status(400).json({ message: error.message });
    }
};

// Controller function to delete recommendation
const deleteRecommendation = async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid recommendation ID' });
    }

    try {
        await handleServiceCall(recommendationService.deleteRecommendation, res, id);
    } catch (error) {
        logger.error(`Error deleting recommendation: ${error.message}`);
        res.status(404).json({ message: error.message });
    }
};

// Controller function to get recommendations by user
const getRecommendationsByUser = async (req, res) => {
    const userId = req.user.id;
    try {
        await handleServiceCall(recommendationService.getRecommendationsByUser, res, userId);
    } catch (error) {
        logger.error(`Error fetching user recommendations: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRecommendation,
    getRecommendationById,
    getAllRecommendations,
    updateRecommendation,
    deleteRecommendation,
    getRecommendationsByUser
};
