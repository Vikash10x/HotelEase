const Staff = require('../models/Staff');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.createStaff = async (req, res) => {
    try {
        const { name, email, password, role, department, salary, shift } = req.body;

        // Check if user already exists
        let userExists = await User.findOne({ email });
        let userId;

        if (userExists) {
            userId = userExists._id;
            // Update role if they are just a customer
            if (userExists.role === 'Customer') {
                userExists.role = role || 'Receptionist';
                await userExists.save();
            }
        } else {
            // Create new user
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = await User.create({
                name,
                email,
                password: hashedPassword,
                role: role || 'Receptionist'
            });
            userId = newUser._id;
        }

        const staff = new Staff({ user: userId, department, salary, shift });
        const createdStaff = await staff.save();

        res.status(201).json(createdStaff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getStaff = async (req, res) => {
    try {
        const staffList = await Staff.find().populate('user', 'name email role');
        res.json(staffList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateStaff = async (req, res) => {
    try {
        const { name, email, role, department, salary, shift } = req.body;

        // Find staff record
        const staff = await Staff.findById(req.params.id);
        if (!staff) return res.status(404).json({ message: 'Staff not found' });

        // Update Staff fields
        if (department !== undefined) staff.department = department;
        if (salary !== undefined) staff.salary = salary;
        if (shift !== undefined) staff.shift = shift;
        await staff.save();

        // Update corresponding User fields
        if (name || email || role) {
            const user = await User.findById(staff.user);
            if (user) {
                if (name) user.name = name;
                if (email) user.email = email;
                if (role) user.role = role;
                await user.save();
            }
        }

        const updatedStaff = await Staff.findById(req.params.id).populate('user', 'name email role');
        res.json(updatedStaff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteStaff = async (req, res) => {
    try {
        const staff = await Staff.findByIdAndDelete(req.params.id);
        if (staff) res.json({ message: 'Staff removed' });
        else res.status(404).json({ message: 'Staff not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
