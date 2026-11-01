const express = require('express');
const router = express.Router();
const preferencesController = require('../controllers/preferencesController');
const { validatePreferences, validatePreferencesUserId } = require('../validators/preferencesValidator');

// Route for creating a new set of preferences
router.post('/', validatePreferences, preferencesController.createPreferences);

// Route for retrieving preferences for a specific user
router.get('/user/:userId', validatePreferencesUserId, preferencesController.getPreferencesByUser);

// Route for updating preferences for a specific user
router.put('/user/:userId', validatePreferencesUserId, validatePreferences, preferencesController.updatePreferences);

// Route for deleting preferences for a specific user
router.delete('/user/:userId', validatePreferencesUserId, preferencesController.deletePreferences);

// Route for retrieving all preferences (for admin/analytics)
router.get('/', preferencesController.getAllPreferences);

module.exports = router;
