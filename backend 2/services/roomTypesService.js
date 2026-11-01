const RoomTypes = require('../models/roomTypes');
const { isValidObjectId } = require('../validators/objectIdValidator');
const logger = require('../utils/logger');

const getRoomTypeById = async (id) => {
    if (!isValidObjectId(id)) throw new Error('Invalid room type ID');

    try {
        const roomType = await RoomTypes.findById(id);
        if (!roomType) throw new Error('Room type not found');
        logger.info('Room type retrieved successfully');
        return roomType;
    } catch (error) {
        logger.error(`Error retrieving room type by ID: ${error.message}`);
        throw new Error('Error retrieving room type by ID: ' + error.message);
    }
};

const getAllRoomTypes = async () => {
    try {
        const roomTypes = await RoomTypes.find();
        logger.info('Room types retrieved successfully');
        return roomTypes;
    } catch (error) {
        logger.error(`Error fetching room types: ${error.message}`);
        throw new Error('Error fetching room types: ' + error.message);
    }
};

const getRoomTypeIdByName = async (name) => {
    try {
        const roomType = await RoomTypes.findOne({ name });
        if (!roomType) throw new Error('Room type not found');
        logger.info(`Room type ID for "${name}" retrieved successfully`);
        return roomType._id;
    } catch (error) {
        logger.error(`Error retrieving room type ID by name: ${error.message}`);
        throw new Error('Error retrieving room type ID by name: ' + error.message);
    }
};

// Function to add a new room type
const addRoomType = async (roomTypeData) => {
    try {
        const newRoomType = new RoomTypes(roomTypeData);
        await newRoomType.save();
        logger.info('New room type added successfully');
        return newRoomType;
    } catch (error) {
        logger.error(`Error adding room type: ${error.message}`);
        throw new Error('Error adding room type: ' + error.message);
    }
};

// Function to update a room type
const updateRoomType = async (roomTypeData) => {
    if (!isValidObjectId(roomTypeData.id)) throw new Error('Invalid room type ID');
    try {
        const updatedRoomType = await RoomTypes.findByIdAndUpdate(roomTypeData.id, {RoomName: roomTypeData.RoomName}, { new: true });
        if (!updatedRoomType) throw new Error('Room type not found');
        logger.info('Room type updated successfully');
        return updatedRoomType;
    } catch (error) {
        logger.error(`Error updating room type: ${error.message}`);
        throw new Error('Error updating room type: ' + error.message);
    }
};

// Function to delete a room type
const deleteRoomType = async (id) => {
    if (!isValidObjectId(id)) throw new Error('Invalid room type ID');
    try {
        const deletedRoomType = await RoomTypes.findByIdAndDelete(id);
        if (!deletedRoomType) throw new Error('Room type not found');
        logger.info('Room type deleted successfully');
        return deletedRoomType;
    } catch (error) {
        logger.error(`Error deleting room type: ${error.message}`);
        throw new Error('Error deleting room type: ' + error.message);
    }
};

module.exports = {
    getRoomTypeById,
    getAllRoomTypes,
    getRoomTypeIdByName,
    addRoomType,
    updateRoomType,
    deleteRoomType
};
