const express = require('express');
const router = express.Router();
const { getDashboardData, getRevenueReport, getBookingsReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, authorize('Admin', 'Manager', 'Receptionist'), getDashboardData);
router.get('/revenue', protect, authorize('Admin', 'Manager'), getRevenueReport);
router.get('/bookings', protect, authorize('Admin', 'Manager'), getBookingsReport);

module.exports = router;
