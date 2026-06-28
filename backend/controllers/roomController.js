const Room = require('../models/Room');
const HousekeepingTask = require('../models/HousekeepingTask');

exports.getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (room) res.json(room);
        else res.status(404).json({ message: 'Room not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createRoom = async (req, res) => {
    try {
        const room = new Room(req.body);
        const createdRoom = await room.save();
        res.status(201).json(createdRoom);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (room) res.json(room);
        else res.status(404).json({ message: 'Room not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (room) res.json({ message: 'Room removed' });
        else res.status(404).json({ message: 'Room not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateRoomStatus = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (room) {
            room.status = req.body.status;
            const updatedRoom = await room.save();
            
            // If room is marked as Available, complete any pending housekeeping tasks
            if (req.body.status === 'Available') {
                await HousekeepingTask.updateMany(
                    { room: room._id, status: { $ne: 'Completed' } },
                    { $set: { status: 'Completed' } }
                );
            }

            res.json(updatedRoom);
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
