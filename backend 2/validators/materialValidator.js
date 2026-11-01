const Joi = require('joi');

const createMaterialSchema = Joi.object({
    name: Joi.string().min(3).required(),
    type: Joi.string().valid('Wood', 'Metal', 'Plastic', 'Glass', 'Fabric', 'Stone').required(),
    description: Joi.string().min(10).required(),
    hex: Joi.string().pattern(/^#[0-9A-F]{6}$/i).required(),
    image: Joi.string().uri().optional()
});

const updateMaterialSchema = Joi.object({
    name: Joi.string().min(3).optional(),
    type: Joi.string().valid('Wood', 'Metal', 'Plastic', 'Glass', 'Fabric', 'Stone').optional(),
    description: Joi.string().min(10).optional(),
    hex: Joi.string().pattern(/^#[0-9A-F]{6}$/i).optional(),
    image: Joi.string().uri().optional()
});

module.exports = {
    createMaterialSchema,
    updateMaterialSchema
};