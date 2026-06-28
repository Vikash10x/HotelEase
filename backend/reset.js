const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Room = require('./models/Room');
const Booking = require('./models/Booking');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to MongoDB for reset...');
        
        await Booking.deleteMany({});
        console.log('All bookings cleared.');

        await Room.updateMany({}, { $set: { status: 'Available' } });
        console.log('All rooms set to Available.');

        console.log('Reset complete!');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
