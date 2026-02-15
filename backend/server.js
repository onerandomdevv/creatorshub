const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

const path = require('path');
const dirname = path.resolve();
app.use('/uploads', express.static(path.join(dirname, '/uploads')));

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Creators Hub Foundry API' });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Run system checks
const { testEmailConfig } = require('./utils/emailConfig');
const { testCloudinaryConnection } = require('./config/cloudinary');

app.listen(PORT, async () => {
    console.log(`📡 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log('🔄 Server verified and restarting...');
    
    // Test connections
    await testEmailConfig();
    await testCloudinaryConnection();
});
