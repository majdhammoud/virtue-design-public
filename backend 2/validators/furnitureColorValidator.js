const Joi = require('joi');
const { isValidObjectId } = require('./objectIdValidator');

// Joi schema for creating or updating a furniture color
const furnitureColorSchema = Joi.object({
    ColorName: Joi.string().min(3).required(),
    ColorTone: Joi.string()
        .valid('Neutral', 'Bold', 'Pastel', 'Monochromatic', 'Earthy', 'Vibrant')
        .required(),
});

// Middleware to validate request body for furniture color creation/update
const validateFurnitureColor = (req, res, next) => {
    const { error } = furnitureColorSchema.validate(req.body, { abortEarly: false, allowUnknown: true });
    if (error) {
        const errorMessages = error.details.map(detail => detail.message).join(', ');
        return res.status(400).json({ message: errorMessages });
    }
    next();
};

// Middleware to validate furniture color ID in request parameters
const validateFurnitureColorId = (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Invalid color ID' });
    }
    next();
};

module.exports = {
    validateFurnitureColor,
    validateFurnitureColorId,
    furnitureColorSchema
};
