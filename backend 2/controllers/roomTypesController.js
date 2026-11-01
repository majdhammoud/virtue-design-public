const roomTypeService = require('../services/roomTypesService');
const logger = require('../utils/logger');
const { handleServiceCall } = require('../utils/handleServiceCall');

// Controller function to get room type by ID
const getRoomTypeByIdController = async (req, res) => {
    const { id } = req.params;
    await handleServiceCall(roomTypeService.getRoomTypeById, res, id);
};

// Controller function to get all room types
const getAllRoomTypesController = async (req, res) => {
    await handleServiceCall(roomTypeService.getAllRoomTypes, res);
};

// Controller function to get room type ID by name
const getRoomTypeIdByNameController = async (req, res) => {
    const { name } = req.params;
    await handleServiceCall(roomTypeService.getRoomTypeIdByName, res, name);
};

// Controller function to add a new room type
const addRoomTypeController = async (req, res) => {
    const roomTypeData = req.body;
    await handleServiceCall(roomTypeService.addRoomType, res, roomTypeData);
};

// Controller function to update a room type
const updateRoomTypeController = async (req, res) => {
    const { id } = req.params;
    const roomTypeData = req.body;
    await handleServiceCall(roomTypeService.updateRoomType, res, { id, ...roomTypeData });
};

// Controller function to delete a room type
const deleteRoomTypeController = async (req, res) => {
    const { id } = req.params;
    await handleServiceCall(roomTypeService.deleteRoomType, res, id);
};

module.exports = {
    getRoomTypeByIdController,
    getAllRoomTypesController,
    getRoomTypeIdByNameController,
    addRoomTypeController,
    updateRoomTypeController,
    deleteRoomTypeController
};