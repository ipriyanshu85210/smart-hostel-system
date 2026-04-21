const express = require('express');
const router = express.Router();
const { getDashboardStats, getMyRoomDetails } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/stats').get(protect, getDashboardStats);
router.route('/my-room').get(protect, authorize('Student'), getMyRoomDetails);

module.exports = router;
