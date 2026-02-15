const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Load env vars from parent directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const resetDb = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Remove all products
    const productResult = await Product.deleteMany({});
    console.log(`🗑️  Cleared ${productResult.deletedCount} products`);

    // Remove all orders
    const orderResult = await Order.deleteMany({});
    console.log(`🗑️  Cleared ${orderResult.deletedCount} orders`);

    console.log('✨ Database reset successful');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error.message);
    process.exit(1);
  }
};

resetDb();
