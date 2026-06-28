const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Checked-in', 'Checked-out', 'Cancelled'],
        default: 'Pending'
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    idType: { type: String, required: true, enum: ['Aadhaar', 'Passport', 'Driving License', 'Voter ID'] },
    idNumber: { type: String, required: true },
    guests: { type: Number, required: true, default: 1 },
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    bookingId: { type: String, unique: true },
    specialRequests: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
