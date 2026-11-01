const Joi = require('joi');

const emailSchema = Joi.string().email().trim().lowercase().required();
const usernameSchema = Joi.string().min(3).max(30).trim().required();
const passwordSchema = Joi.string().min(6).required();
const confirmPasswordSchema = Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match'
});

// Schema for verification code
const verificationSchema = Joi.object({
    email: emailSchema,
    verificationCode: Joi.string().required(),
});

// Schema for registration
const registerSchema = Joi.object({
    email: emailSchema,
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
});

// Schema for login
const loginSchema = Joi.object({
    username: usernameSchema,
    password: passwordSchema,
});

module.exports = {
    emailSchema,
    verificationSchema,
    registerSchema,
    loginSchema,
};
