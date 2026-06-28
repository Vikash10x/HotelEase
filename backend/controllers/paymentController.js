const Payment = require('../models/Payment');
const Razorpay = require('razorpay');
const crypto = require('crypto');

exports.createRazorpayOrder = async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: req.body.amount * 100, // amount in smallest currency unit
            currency: "USD",
            receipt: "receipt_order_" + Math.floor(Math.random() * 10000),
        };

        const order = await instance.orders.create(options);
        if (!order) return res.status(500).json({ message: "Some error occured" });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyRazorpayPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            return res.status(200).json({ message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ message: "Invalid signature sent!" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createPayment = async (req, res) => {
    try {
        const payment = new Payment(req.body);
        const createdPayment = await payment.save();
        res.status(201).json(createdPayment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate({
            path: 'booking',
            populate: { path: 'customer', select: 'name' }
        });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePaymentStatus = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (payment) {
            payment.status = req.body.status;
            const updatedPayment = await payment.save();
            res.json(updatedPayment);
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
