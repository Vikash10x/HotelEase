const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    department: { type: String, required: true },
    salary: { type: Number, required: true },
    shift: { type: String, required: true }, // e.g. Morning, Evening, Night
    hireDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
