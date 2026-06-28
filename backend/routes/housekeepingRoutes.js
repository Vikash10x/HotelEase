const express = require('express');
const router = express.Router();
const { getTasks, updateTaskStatus } = require('../controllers/housekeepingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/tasks', protect, authorize('Admin', 'Housekeeping Staff', 'Receptionist', 'Manager'), getTasks);
router.patch('/tasks/:id/status', protect, authorize('Admin', 'Housekeeping Staff', 'Receptionist'), updateTaskStatus);

module.exports = router;
