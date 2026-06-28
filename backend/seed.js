const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // Updated to bcryptjs as per package.json
const User = require('./models/User');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
const Payment = require('./models/Payment');
const Staff = require('./models/Staff');
const Customer = require('./models/Customer');
const HousekeepingTask = require('./models/HousekeepingTask');

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB...');

        // Creating collections by clearing them out or just ensuring they exist
        // Mongoose automatically creates collections when saving documents,
        // but we can enforce creation by creating the collections directly
        await User.createCollection();
        await Room.createCollection();
        await Booking.createCollection();
        await Payment.createCollection();
        await Staff.createCollection();
        await Customer.createCollection();
        await HousekeepingTask.createCollection();

        console.log('Collections ensured: users, rooms, bookings, payments, staffs, customers, housekeepingtasks');

        // Check if Admin exists
        const adminExists = await User.findOne({ role: 'Admin' });
        if (!adminExists) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            await User.create({
                name: 'System Admin',
                email: 'admin@hotelease.com',
                password: hashedPassword,
                role: 'Admin'
            });
            console.log('Default Admin user created!');
            console.log('Email: admin@hotelease.com');
            console.log('Password: admin123');
        } else {
            console.log('Admin user already exists.');
        }

        // Seed default rooms (delete old ones first to ensure they get updated)
        await Room.deleteMany({});
        await Room.insertMany([
            {
                roomNumber: '101',
                type: 'Single',
                price: 1200,
                capacity: 1,
                status: 'Available',
                images: ['/rooms/single.png'],
                description: 'Basic single room with bed, Wi-Fi, AC and attached bathroom.',
                amenities: ['Wi-Fi', 'Air Conditioning', 'Attached Bathroom']
            },
            {
                roomNumber: '102',
                type: 'Double',
                price: 1800,
                capacity: 2,
                status: 'Available',
                images: ['/rooms/double.png'],
                description: 'Comfortable double room for two guests with AC, Wi-Fi and TV.',
                amenities: ['Air Conditioning', 'Wi-Fi', 'Smart TV']
            },
            {
                roomNumber: '201',
                type: 'Deluxe',
                price: 2500,
                capacity: 2,
                status: 'Available',
                images: ['/rooms/deluxe.png'],
                description: 'Premium deluxe room with king bed, city view, AC, Wi-Fi and room service.',
                amenities: ['King Bed', 'City View', 'Air Conditioning', 'Wi-Fi', 'Room Service']
            },
            {
                roomNumber: '202',
                type: 'Family',
                price: 3500,
                capacity: 4,
                status: 'Available',
                images: ['/rooms/family.png'],
                description: 'Spacious family room with two beds, AC, Wi-Fi, TV and attached bathroom.',
                amenities: ['Two Beds', 'Air Conditioning', 'Wi-Fi', 'Smart TV', 'Attached Bathroom']
            },
            {
                roomNumber: '301',
                type: 'Presidential Suite',
                price: 5000,
                capacity: 3,
                status: 'Available',
                images: ['/rooms/suite.png'],
                description: 'Luxury suite with living area, king bed, premium bathroom, AC and room service.',
                amenities: ['Living Area', 'King Bed', 'Premium Bathroom', 'Air Conditioning', 'Room Service']
            }
        ]);
        console.log('Default Rooms created!');

        console.log('Database Initialization Complete!');
        process.exit();
    } catch (error) {
        console.error('Error with database initialization:', error);
        process.exit(1);
    }
};

seedDatabase();
