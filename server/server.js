const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes');

const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Performance Middleware
app.use(helmet()); // Secure HTTP headers
app.use(compression()); // Compress responses
app.use(cors({
    origin: process.env.CLIENT_URL || '*', // Restrict to frontend origin if available
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api/', limiter);

app.use(express.json());

// Request Logger (only in dev if needed, or structured logging for production)
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
        next();
    });
}

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Database Connection
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('---------------------------------');
        console.log('✅ Connected to MongoDB Successfully');
        console.log('---------------------------------');
    })
    .catch(err => {
        console.log('---------------------------------');
        console.error('❌ Could not connect to MongoDB!');
        console.error('Error Details:', err.message);
        console.log('---------------------------------');
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
