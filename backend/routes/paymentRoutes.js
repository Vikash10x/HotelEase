const express = require('express');
const router = express.Router();
const { createPayment, getPayments, updatePaymentStatus, createRazorpayOrder, verifyRazorpayPayment } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createPayment)
    .get(protect, authorize('Admin', 'Manager', 'Receptionist'), getPayments);

router.patch('/:id/status', protect, authorize('Admin', 'Receptionist'), updatePaymentStatus);

router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyRazorpayPayment);

module.exports = router;
