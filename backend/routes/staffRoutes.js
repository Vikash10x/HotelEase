const express = require('express');
const router = express.Router();
const { createStaff, getStaff, updateStaff, deleteStaff } = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('Admin'), createStaff)
    .get(protect, authorize('Admin', 'Manager'), getStaff);

router.route('/:id')
    .put(protect, authorize('Admin'), updateStaff)
    .delete(protect, authorize('Admin'), deleteStaff);

module.exports = router;
