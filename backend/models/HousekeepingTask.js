const mongoose = require('mongoose');

const housekeepingTaskSchema = new mongoose.Schema({
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    taskDescription: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'In Progress', 'Completed'], 
        default: 'Pending' 
    }
}, { timestamps: true });

module.exports = mongoose.model('HousekeepingTask', housekeepingTaskSchema);
