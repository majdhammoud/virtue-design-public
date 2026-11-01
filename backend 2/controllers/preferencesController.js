const preferencesService = require('../services/preferencesService');
const { isValidObjectId } = require('../validators/objectIdValidator');
const Joi = require('joi');
const { validateRequest } = require('../utils/validateRequest');
const { handleServiceCall } = require('../utils/handleServiceCall');

// Updated Joi validation schema to match the Preferences model
const preferencesSchema = Joi.object({
    UserID: Joi.string().required(),
    VibePreference: Joi.string().valid('Minimalist', 'Rustic', 'Modern', 'Bohemian', 'Industrial', 'Traditional').optional(),
    ColorPreferences: Joi.string().valid('Neutral', 'Bold', 'Pastel', 'Monochromatic', 'Earthy', 'Vibrant').required()
});

// Controller function to create preferences
const createPreferences = (req, res) => {
    try {
        validateRequest(req, res, () => {}, preferencesSchema);
        handleServiceCall(preferencesService.createPreferences, res, req.body);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller function to get preferences by user ID
const getPreferencesByUser = (req, res) => {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    handleServiceCall(preferencesService.getPreferencesByUser, res, userId);
};

// Controller function to update preferences by user ID
const updatePreferences = (req, res) => {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    try {
        validateRequest(req, res, () => {}, preferencesSchema);
        handleServiceCall(preferencesService.updatePreferences, res, userId, req.body);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Controller function to delete preferences by user ID
const deletePreferences = (req, res) => {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    handleServiceCall(preferencesService.deletePreferences, res, userId);
};

// Controller function to get all preferences
const getAllPreferences = (req, res) => {
    handleServiceCall(preferencesService.getAllPreferences, res);
};

module.exports = {
    createPreferences,
    getPreferencesByUser,
    updatePreferences,
    deletePreferences,
    getAllPreferences
};
