const express = require('express');
const router = express.Router();
const { createBooking, getBookings, getMyBookings, getBookingById, updateBookingStatus, cancelBooking } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createBooking)
    .get(protect, authorize('Admin', 'Receptionist', 'Manager'), getBookings);

router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getBookingById);
router.patch('/:id/status', protect, authorize('Admin', 'Receptionist'), updateBookingStatus);
router.patch('/:id/cancel', protect, cancelBooking);

module.exports = router;
