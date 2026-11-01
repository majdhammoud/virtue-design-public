const Design = require('../models/designs');
const User = require('../models/user');
const logger = require('../utils/logger');

const createDesign = async (userId, designData) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const design = new Design({ ...designData, user: userId });
    await design.save();

    user.designs.push(design._id);
    await user.save();

    logger.info(`Design created for user ${userId} with ID ${design._id}`);
    return design;
};

const getDesignById = async (designId) => {
    const design = await Design.findById(designId).populate('user');
    if (!design) throw new Error('Design not found');
    return design;
};

const updateDesign = async (designId, designData) => {
    const design = await Design.findByIdAndUpdate(designId, designData, { new: true });
    if (!design) throw new Error('Design not found');
    return design;
};

const deleteDesign = async (designId) => {
    const design = await Design.findByIdAndDelete(designId);
    if (!design) throw new Error('Design not found');

    const user = await User.findById(design.user);
    user.designs.pull(design._id);
    await user.save();

    return design;
};

const getDesignRecommendations = async (designId) => {
    const design = await Design.findById(designId).populate('recommendations');
    if (!design) throw new Error('Design not found');
    return design.recommendations;
};

const getDesignsByUser = async (userId) => {
    const user = await User.findById(userId).populate('designs');
    if (!user) throw new Error('User not found');
    return user.designs;
};

module.exports = {
    createDesign,
    getDesignById,
    updateDesign,
    deleteDesign,
    getDesignRecommendations,
    getDesignsByUser
};
