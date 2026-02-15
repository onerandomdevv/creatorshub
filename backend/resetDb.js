const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('./models/Order');

dotenv.config();

const resetData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    await Order.deleteMany({});
    console.log('All Orders cleared');

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

resetData();
