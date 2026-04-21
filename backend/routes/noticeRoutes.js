const express = require('express');
const router = express.Router();
const { getNotices, getNoticeById, createNotice, updateNotice, deleteNotice } = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(protect, getNotices).post(protect, authorize('Admin'), createNotice);
router.route('/:id').get(protect, getNoticeById).put(protect, authorize('Admin'), updateNotice).delete(protect, authorize('Admin'), deleteNotice);

module.exports = router;
