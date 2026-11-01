const express = require('express');
const router = express.Router();
const {getUserByUsername, getUserByEmail, getUserIdByUsername, getUsernameByUserId, getUserJoinDateByUsername, addPreferences, getPreferences } = require('../controllers/userController');

// User routes
router.get('/username/:username', getUserByUsername);
router.get('/user/email/:email', getUserByEmail);
router.get('/userId/:username', getUserIdByUsername);
router.get('/joinDate/:username', getUserJoinDateByUsername);

// Preferences routes
router.post('/preferences', addPreferences);
// router.put('/preferences', updatePreferences);
// router.delete('/preferences', deletePreferences);
router.get('/preferences', getPreferences);

// Location routes
// router.put('/location', updateLocation);

module.exports = router;
