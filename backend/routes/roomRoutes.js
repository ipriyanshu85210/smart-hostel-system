const express = require('express');
const router = express.Router();
const { getRooms, getRoomById, createRoom, updateRoom, deleteRoom, getAvailableRooms } = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/available').get(protect, authorize('Student', 'Admin'), getAvailableRooms);
router.route('/').get(protect, authorize('Admin'), getRooms).post(protect, authorize('Admin'), createRoom);
router.route('/:id').get(protect, authorize('Admin'), getRoomById).put(protect, authorize('Admin'), updateRoom).delete(protect, authorize('Admin'), deleteRoom);

module.exports = router;
