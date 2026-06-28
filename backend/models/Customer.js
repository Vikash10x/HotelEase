const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    phoneNumber: { type: String },
    address: { type: String },
    idProofType: { type: String }, // e.g. Passport, Driving License
    idProofNumber: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
