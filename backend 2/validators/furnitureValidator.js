const Joi = require('joi');

const furnitureSchema = Joi.object({
    FurnitureName: Joi.string().min(3).required(),
    FurnitureCategoryID: Joi.string().required(),
    FurnitureColorID: Joi.string().required(),
    FurnitureWidth: Joi.number().required(),
    FurnitureHeight: Joi.number().required(),
    FurnitureDepth: Joi.number().required(),
    FurniturePrice: Joi.number().min(0).required(),
    FurnitureMaterialID: Joi.string().required(),
    StoreID: Joi.string().required(),
    RoomTypeID: Joi.string().required(),
    FurniturePicture: Joi.string().uri().optional().allow(null)
});

module.exports = { furnitureSchema };
