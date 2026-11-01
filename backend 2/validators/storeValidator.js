const Joi = require('joi');

const storeSchema = Joi.object({
    StoreName: Joi.string().required(),
    Location: Joi.object({
        type: Joi.string().valid('Point').required(),
        Coordinates: Joi.array().items(Joi.number()).length(2).required()
    }).required(),
    Address: Joi.string().required(),
    Website: Joi.string().uri().optional()
});

const validateStore = (storeData) => {
    const { error, value } = storeSchema.validate(storeData);
    if (error) {
        throw new Error(error.details[0].message);
    }
    return value;
};

module.exports = {
    validateStore
};
