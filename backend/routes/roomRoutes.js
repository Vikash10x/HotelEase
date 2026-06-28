const express = require('express');
const router = express.Router();
const { getRooms, getRoomById, createRoom, updateRoom, deleteRoom, updateRoomStatus } = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getRooms)
    .post(protect, authorize('Admin'), createRoom);

router.route('/:id')
    .get(getRoomById)
    .put(protect, authorize('Admin'), updateRoom)
    .delete(protect, authorize('Admin'), deleteRoom);

router.patch('/:id/status', protect, authorize('Admin', 'Receptionist', 'Housekeeping Staff'), updateRoomStatus);

module.exports = router;
