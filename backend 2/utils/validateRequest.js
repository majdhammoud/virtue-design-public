const Joi = require('joi');

const validateRequest = (req, res, next, schema) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, allowUnknown: true });
    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        throw new Error(errorMessages.join(', '));
    }
    
    next();
};

module.exports = { validateRequest };