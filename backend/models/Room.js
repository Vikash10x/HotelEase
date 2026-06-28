const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomNumber: { type: String, required: true, unique: true },
    type: { type: String, required: true }, // e.g. Single, Double, Suite
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    amenities: [{ type: String }],
    status: { 
        type: String, 
        enum: ['Available', 'Booked', 'Occupied', 'Cleaning'], 
        default: 'Available' 
    },
    images: [{ type: String }], // URLs
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
