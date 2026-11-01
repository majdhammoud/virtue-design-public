const Joi = require('joi');
const {
    findUserByUsername,
    findUserByEmail,
    findUserIdByUsername,
    findUsernameByUserId,
    getUserJoinDate
} = require('../services/userService');
const preferencesService = require('../services/preferencesService'); // Assuming preferencesService is defined in a separate file
const jwt = require('jsonwebtoken'); // Assuming you're using jsonwebtoken for token decoding
// Validation schema
const usernameSchema = Joi.object({
    username: Joi.string().trim().min(3).required().messages({
        'string.empty': 'Username is required',
        'string.min': 'Username must be at least 3 characters long',
        'any.required': 'Username is required'
    })
});

const emailSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required'
    })
});

// Controller to get user by username
const getUserByUsername = async (req, res) => {
    const { error } = usernameSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username } = req.params;

    try {
        const user = await findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch user by username.' });
    }
};

// Controller to get user by email
const getUserByEmail = async (req, res) => {
    const { error } = emailSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email } = req.params;

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch user by email.' });
    }
};

// Controller to get user ID by username
const getUserIdByUsername = async (req, res) => {
    const { error } = usernameSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username } = req.params;

    try {
        const userId = await findUserIdByUsername(username);
        res.status(200).json({ userId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch user ID by username.' });
    }
};

// Controller to get username by user ID
const getUsernameByUserId = async (req, res) => {
    const { userId } = req.params;
    if (typeof userId !== 'string' || !userId.trim()) {
        return res.status(400).json({ message: 'A valid user ID is required.' });
    }

    try {
        const username = await findUsernameByUserId(userId);
        res.status(200).json({ username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch username by user ID.' });
    }
};

// Controller to get user join date by username
const getUserJoinDateByUsername = async (req, res) => {
    const { error } = usernameSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username } = req.params;

    try {
        const joinDate = await getUserJoinDate(username);
        res.status(200).json({ joinDate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch user join date.' });
    }
};

const addPreferences = async (req, res) => {
    const { VibePreference, ColorPreferences } = req.body;
    if (!VibePreference || !ColorPreferences) {
        return res.status(400).json({ message: 'User ID, Vibe Preference, and Color Preferences are required.' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header is missing or invalid' });
    }
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.decode(token);
    const UserID = decodedToken?.userId;
    try {
        // Call the service to add preferences
        const preferences = await preferencesService.createPreferences({UserID, VibePreference, ColorPreferences});
        res.status(201).json(preferences);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add preferences.' });
    }
};

const getPreferences = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header is missing or invalid' });
    }
    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.decode(token);
    const UserID = decodedToken?.userId;
    try {
        // Call the service to get preferences
        const preferences = await preferencesService.getPreferencesByUser(UserID);
        res.status(200).json(preferences);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch preferences.' });
    }
};

module.exports = {
    getUserByUsername,
    getUserByEmail,
    getUserIdByUsername,
    getUsernameByUserId,
    getUserJoinDateByUsername,
    addPreferences,
    getPreferences
};
