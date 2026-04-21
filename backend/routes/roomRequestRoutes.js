const express = require('express');
const router = express.Router();
const { createRequest, getRequests, updateRequestStatus } = require('../controllers/roomRequestController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(protect, getRequests).post(protect, authorize('Student'), createRequest);
router.route('/:id/status').put(protect, authorize('Admin'), updateRequestStatus);

module.exports = router;
