const Joi = require('joi');

const createFurnitureCategorySchema = Joi.object({
    name: Joi.string().required(),      
    roomType: Joi.string().required()     
});

const updateFurnitureCategorySchema = Joi.object({
    name: Joi.string().optional(),
    roomType: Joi.string().optional()
});

module.exports = {
    createFurnitureCategorySchema,
    updateFurnitureCategorySchema
};