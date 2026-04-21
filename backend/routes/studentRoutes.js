const express = require('express');
const router = express.Router();
const { getStudents, getStudentById, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(protect, authorize('Admin'), getStudents).post(protect, authorize('Admin'), createStudent);
router.route('/:id').get(protect, authorize('Admin'), getStudentById).put(protect, authorize('Admin'), updateStudent).delete(protect, authorize('Admin'), deleteStudent);

module.exports = router;
