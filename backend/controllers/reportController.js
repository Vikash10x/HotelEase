const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Room = require('../models/Room');

exports.getDashboardData = async (req, res) => {
    try {
        const totalRooms = await Room.countDocuments();
        const availableRooms = await Room.countDocuments({ status: 'Available' });
        const totalBookings = await Booking.countDocuments();
        const payments = await Payment.find({ status: 'Paid' });
        const revenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

        res.json({ totalRooms, availableRooms, totalBookings, revenue });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRevenueReport = async (req, res) => {
    try {
        const payments = await Payment.find({ status: 'Paid' }).populate('booking');
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBookingsReport = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('customer', 'name email').populate('room', 'roomNumber');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
