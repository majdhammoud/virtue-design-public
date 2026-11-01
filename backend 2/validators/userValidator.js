const Joi = require('joi');

// Validation schema for username
const usernameSchema = Joi.object({
    username: Joi.string().trim().min(3).required().messages({
        'string.empty': 'Username is required',
        'string.min': 'Username must be at least 3 characters long',
        'any.required': 'Username is required'
    })
});

// Validation schema for email
const emailSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address',
        'any.required': 'Email is required'
    })
});

module.exports = {
    usernameSchema,
    emailSchema,
};
