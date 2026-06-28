const HousekeepingTask = require('../models/HousekeepingTask');
const Room = require('../models/Room');

exports.getTasks = async (req, res) => {
    try {
        const tasks = await HousekeepingTask.find().populate('room', 'roomNumber status').populate('assignedTo', 'name');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTaskStatus = async (req, res) => {
    try {
        const task = await HousekeepingTask.findById(req.params.id);
        if (task) {
            task.status = req.body.status;
            const updatedTask = await task.save();

            if (req.body.status === 'Completed') {
                const room = await Room.findById(task.room);
                room.status = 'Available';
                await room.save();
            }

            res.json(updatedTask);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
