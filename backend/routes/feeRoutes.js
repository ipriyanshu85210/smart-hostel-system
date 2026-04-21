const express = require('express');
const router = express.Router();
const { getFees, getFeeById, createFee, updateFee, deleteFee } = require('../controllers/feeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(protect, authorize('Admin'), getFees).post(protect, authorize('Admin'), createFee);
router.route('/:id').get(protect, authorize('Admin'), getFeeById).put(protect, authorize('Admin'), updateFee).delete(protect, authorize('Admin'), deleteFee);

module.exports = router;
