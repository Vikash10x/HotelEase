const Booking = require('../models/Booking');
const Room = require('../models/Room');
const HousekeepingTask = require('../models/HousekeepingTask');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

exports.createBooking = async (req, res) => {
    try {
        const { 
            room, 
            checkInDate, 
            checkOutDate, 
            totalAmount, 
            specialRequests,
            fullName,
            email,
            phone,
            idType,
            idNumber,
            guests,
            paymentStatus
        } = req.body;

        // Prevent double booking
        const existingBookings = await Booking.find({
            room,
            status: { $in: ['Pending', 'Confirmed', 'Checked-in'] },
            $or: [
                { checkInDate: { $lte: checkOutDate }, checkOutDate: { $gte: checkInDate } }
            ]
        });

        if (existingBookings.length > 0) {
            return res.status(400).json({ message: 'Room is already booked for these dates' });
        }

        // Generate Booking ID like BK2026001
        const count = await Booking.countDocuments();
        const nextSerial = String(count + 1).padStart(3, '0');
        const bookingId = `BK${new Date().getFullYear()}${nextSerial}`;

        const booking = new Booking({
            customer: req.user.id,
            room,
            checkInDate,
            checkOutDate,
            totalAmount,
            specialRequests,
            fullName,
            email,
            phone,
            idType,
            idNumber,
            guests: guests || 1,
            paymentStatus: paymentStatus || 'pending',
            bookingId,
            status: 'Confirmed'
        });

        const createdBooking = await booking.save();

        // Update the room status immediately to Booked so it reflects in the UI
        const bookedRoom = await Room.findById(room);
        if (bookedRoom) {
            bookedRoom.status = 'Booked';
            await bookedRoom.save();
        }

        const customer = await User.findById(req.user.id);
        if (customer && customer.email && process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com') {
            const emailMessage = `
                <h2>Booking Confirmation - HotelEase</h2>
                <p>Dear ${customer.name},</p>
                <p>Your booking has been successfully confirmed!</p>
                <p><strong>Room:</strong> ${bookedRoom ? bookedRoom.type : 'Standard'} (Room No: ${bookedRoom ? bookedRoom.roomNumber : ''})</p>
                <p><strong>Check-in:</strong> ${new Date(checkInDate).toLocaleDateString()}</p>
                <p><strong>Check-out:</strong> ${new Date(checkOutDate).toLocaleDateString()}</p>
                <p><strong>Amount Paid:</strong> $${totalAmount}</p>
                <br/>
                <p>We look forward to hosting you!</p>
                <p>Best Regards,<br/>HotelEase Team</p>
            `;
            await sendEmail({
                email: customer.email,
                subject: 'Booking Confirmation - HotelEase',
                message: emailMessage
            });
        }

        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('customer', 'name email').populate('room', 'roomNumber type');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ customer: req.user.id }).populate('room', 'roomNumber type images price');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('customer', 'name email').populate('room');
        if (booking) res.json(booking);
        else res.status(404).json({ message: 'Booking not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateBookingStatus = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (booking) {
            booking.status = req.body.status;
            const updatedBooking = await booking.save();

            // Update room status
            const room = await Room.findById(booking.room);
            if (req.body.status === 'Confirmed') room.status = 'Booked';
            if (req.body.status === 'Checked-in') room.status = 'Occupied';
            if (req.body.status === 'Checked-out') {
                room.status = 'Cleaning';
                // Auto-generate housekeeping task
                await HousekeepingTask.create({
                    room: room._id,
                    taskDescription: 'Regular room cleaning after check-out'
                });

                // Send Checkout Invoice Email
                const bookingDetails = await Booking.findById(req.params.id).populate('customer');
                if (bookingDetails && bookingDetails.customer && bookingDetails.customer.email && process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your_email@gmail.com') {
                     const emailMessage = `
                        <h2>Thank you for your stay! - HotelEase</h2>
                        <p>Dear ${bookingDetails.customer.name},</p>
                        <p>You have successfully checked out of Room ${room.roomNumber}.</p>
                        <p><strong>Total Amount Settled:</strong> $${bookingDetails.totalAmount}</p>
                        <br/>
                        <p>We hope you had a pleasant stay and look forward to welcoming you back!</p>
                        <p>Best Regards,<br/>HotelEase Team</p>
                    `;
                    await sendEmail({
                        email: bookingDetails.customer.email,
                        subject: 'Check-out & Invoice - HotelEase',
                        message: emailMessage
                    });
                }
            }
            if (req.body.status === 'Cancelled') room.status = 'Available';
            await room.save();

            res.json(updatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (booking) {
            if (booking.customer.toString() !== req.user.id && req.user.role === 'Customer') {
                return res.status(403).json({ message: 'Not authorized to cancel this booking' });
            }
            booking.status = 'Cancelled';
            const updatedBooking = await booking.save();

            const room = await Room.findById(booking.room);
            room.status = 'Available';
            await room.save();

            res.json(updatedBooking);
        } else {
            res.status(404).json({ message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
