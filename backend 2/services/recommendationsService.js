const Recommendation = require('../models/recommendations');
const { isValidObjectId } = require('../validators/objectIdValidator');
const logger = require('../utils/logger');

// Service function to create recommendation
const createRecommendation = async (data) => {
    try {
        const recommendation = await Recommendation.create(data);
        logger.info('Recommendation created successfully');
        return recommendation._id; // Returning the ID of the created recommendation
    } catch (error) {
        logger.error('Error creating recommendation: ' + error.message);
        throw new Error('Error creating recommendation: ' + error.message);
    }
};

// Service function to get recommendation by ID
const getRecommendationById = async (id) => {
    if (!isValidObjectId(id)) throw new Error('Invalid recommendation ID');

    try {
        const recommendation = await Recommendation.findById(id);
        if (!recommendation) throw new Error('Recommendation not found');
        logger.info('Recommendation retrieved successfully');
        return recommendation;
    } catch (error) {
        logger.error('Error retrieving recommendation by ID: ' + error.message);
        throw new Error('Error retrieving recommendation by ID: ' + error.message);
    }
};

// Service function to get all recommendations
const getAllRecommendations = async () => {
    try {
        const recommendations = await Recommendation.find();
        logger.info('All recommendations retrieved successfully');
        return recommendations;
    } catch (error) {
        logger.error('Error fetching recommendations: ' + error.message);
        throw new Error('Error fetching recommendations');
    }
};

// Service function to update recommendation
const updateRecommendation = async (id, data) => {
    if (!isValidObjectId(id)) throw new Error('Invalid recommendation ID');

    try {
        const updatedRecommendation = await Recommendation.findByIdAndUpdate(id, data, { new: true });
        if (!updatedRecommendation) throw new Error('Recommendation not found');
        logger.info('Recommendation updated successfully');
        return updatedRecommendation;
    } catch (error) {
        logger.error('Error updating recommendation: ' + error.message);
        throw new Error('Error updating recommendation: ' + error.message);
    }
};

// Service function to delete recommendation
const deleteRecommendation = async (id) => {
    if (!isValidObjectId(id)) throw new Error('Invalid recommendation ID');

    try {
        const deletedRecommendation = await Recommendation.findByIdAndDelete(id);
        if (!deletedRecommendation) throw new Error('Recommendation not found');
        logger.info('Recommendation deleted successfully');
        return true;
    } catch (error) {
        logger.error('Error deleting recommendation: ' + error.message);
        throw new Error('Error deleting recommendation: ' + error.message);
    }
};

// Service function to get recommendations by user
const getRecommendationsByUser = async (userId) => {
    try {
        const recommendations = await Recommendation.find({ user: userId });
        logger.info('Recommendations retrieved successfully for user');
        return recommendations;
    } catch (error) {
        logger.error('Error fetching recommendations for user: ' + error.message);
        throw new Error('Error fetching recommendations for user');
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
