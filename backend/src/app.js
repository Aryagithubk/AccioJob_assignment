// app.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');




const app = express();

// Middleware
app.use(cookieParser());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/session', require('./routes/sessionRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/export', require('./routes/exportRoutes'));

// Error handler
app.use(errorHandler);

module.exports = app;
