const Joi = require('joi');
const { isValidObjectId } = require('./objectIdValidator');

// Define the Joi schema to validate preferences data
const preferencesSchema = Joi.object({
    UserID: Joi.string().required(),
    VibePreference: Joi.string()
        .valid('Minimalist', 'Rustic', 'Modern', 'Bohemian', 'Industrial', 'Traditional')
        .optional(),
    ColorPreferences: Joi.string()
        .valid('Neutral', 'Bold', 'Pastel', 'Monochromatic', 'Earthy', 'Vibrant')
        .required()
});

// Middleware to validate the request body for preferences creation/update
const validatePreferences = (req, res, next) => {
    const { error } = preferencesSchema.validate(req.body, { abortEarly: false, allowUnknown: true });
    if (error) {
        const errorMessages = error.details.map(detail => detail.message).join(', ');
        return res.status(400).json({ message: errorMessages });
    }
    next();
};

// Middleware to validate the user ID in route parameters (for get/update/delete)
const validatePreferencesUserId = (req, res, next) => {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    next();
};

module.exports = {
    preferencesSchema,
    validatePreferences,
    validatePreferencesUserId
};
