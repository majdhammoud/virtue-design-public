const logger = require('../utils/logger');

const handleServiceCall = async (serviceFunction, res, ...args) => {
    try {
        const result = await serviceFunction(...args);
        res.status(200).json(result);
    } catch (error) {
        logger.error(`Error in ${serviceFunction.name}: ${error.message}`, {
            stack: error.stack,
            args
        });
        res.status(400).json({ message: error.message });
    }
};

module.exports = { handleServiceCall };