const express = require('express');
const { getRoomTypeByIdController, getAllRoomTypesController, getRoomTypeIdByNameController, addRoomTypeController, updateRoomTypeController, deleteRoomTypeController } = require('../controllers/roomTypesController');
const requireAdmin = require('../middleware/authAdminMiddleware');
const router = express.Router();

router.get('/:id', getRoomTypeByIdController);
router.get('/', getAllRoomTypesController);
router.get('/name/:name', getRoomTypeIdByNameController);
router.post('/', requireAdmin, addRoomTypeController);
router.put('/:id', requireAdmin, updateRoomTypeController);
router.delete('/:id', requireAdmin, deleteRoomTypeController);

module.exports = router;
