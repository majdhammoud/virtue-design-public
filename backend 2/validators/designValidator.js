const Joi = require('joi');

const designValidationSchema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().optional(),
    materials: Joi.array().items(Joi.string()).optional(),
    furniture: Joi.array().items(Joi.string()).optional(),
    layout: Joi.object().required(),
});

const validateDesignId = (designId) => {
    const schema = Joi.string().hex().length(24).required();
    return schema.validate(designId);
};

module.exports = {
    designValidationSchema,
    validateDesignId,
};
