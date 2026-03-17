const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post('/signup', async (req, res) => {
    console.log('--- Signup Request Received ---');
    console.log('Body:', req.body);
    try {
        const { email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('Signup failed: User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }

        console.log('Creating user in database...');
        const user = await User.create({ email, password });

        if (user) {
            console.log('User created successfully:', user._id);
            res.status(201).json({
                _id: user._id,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            console.log('Signup failed: Could not create user object');
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
    console.log('--- Login Request Received ---');
    console.log('Body:', req.body);
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            console.log('Login successful for:', email);
            res.json({
                _id: user._id,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            console.log('Login failed: Invalid credentials for:', email);
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
