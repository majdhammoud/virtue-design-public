const Preferences = require('../models/preferences');
const { isValidObjectId } = require('../validators/objectIdValidator');
const logger = require('../utils/logger');

// Service function to create preferences
const createPreferences = async (preferencesData) => {
    try {
        let preferences = await Preferences.findOne({ UserID: preferencesData.UserID });
        if (preferences) {
            preferences = await Preferences.findOneAndUpdate({ UserID: preferencesData.UserID }, preferencesData, { new: true });
        } else {
            preferences = await Preferences.create(preferencesData);
        }
        logger.info('Preferences created successfully');
        return preferences;
    } catch (error) {
        logger.error('Error creating preferences: ' + error.message);
        throw new Error('Error creating preferences');
    }
};

// Service function to get preferences by user ID
const getPreferencesByUser = async (userId) => {
    if (!isValidObjectId(userId)) {
        throw new Error('Invalid user ID');
    }
    try {
        // Use "UserID" as per model definition
        const preferences = await Preferences.findOne({ UserID: userId });
        if (!preferences) {
            throw new Error('Preferences not found');
        }
        logger.info('Preferences retrieved successfully');
        return preferences;
    } catch (error) {
        logger.error('Error fetching preferences: ' + error.message);
        throw new Error('Error fetching preferences');
    }
};

// Service function to update preferences by user ID
const updatePreferences = async (userId, preferencesData) => {
    if (!isValidObjectId(userId)) {
        throw new Error('Invalid user ID');
    }
    try {
        const preferences = await Preferences.findOneAndUpdate({ UserID: userId }, preferencesData, { new: true });
        if (!preferences) {
            throw new Error('Preferences not found');
        }
        logger.info('Preferences updated successfully');
        return preferences;
    } catch (error) {
        logger.error('Error updating preferences: ' + error.message);
        throw new Error('Error updating preferences');
    }
};

// Service function to delete preferences by user ID
const deletePreferences = async (userId) => {
    if (!isValidObjectId(userId)) {
        throw new Error('Invalid user ID');
    }
    try {
        const result = await Preferences.findOneAndDelete({ UserID: userId });
        if (!result) {
            throw new Error('Preferences not found');
        }
        logger.info('Preferences deleted successfully');
        return true;
    } catch (error) {
        logger.error('Error deleting preferences: ' + error.message);
        throw new Error('Error deleting preferences');
    }
};

// Service function to get all preferences
const getAllPreferences = async () => {
    try {
        const preferences = await Preferences.find();
        logger.info('All preferences retrieved successfully');
        return preferences;
    } catch (error) {
        logger.error('Error fetching all preferences: ' + error.message);
        throw new Error('Error fetching all preferences');
    }
};

module.exports = {
    createPreferences,
    getPreferencesByUser,
    updatePreferences,
    deletePreferences,
    getAllPreferences
};
