const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');

dotenv.config();

const products = [
    {
        name: 'Sony A7IV Mirrorless Camera',
        image: '/images/products/sony-a7iv.png',
        description: 'The all-arounder mirrorless for creators. 33MP Full-frame sensor, 4K 60p video, and incredible autofocus.',
        brand: 'Sony',
        category: 'Cameras',
        niche: ['Content Creation', 'Streaming'],
        price: 2499.99,
        countInStock: 5,
        rating: 4.8,
        numReviews: 12,
        isFeatured: true
    },
    {
        name: 'Shure SM7B Vocal Microphone',
        image: '/images/products/shure-sm7b.png',
        description: 'The industry standard for podcasting and streaming. Smooth, flat, wide-range frequency response.',
        brand: 'Shure',
        category: 'Audio',
        niche: ['Streaming', 'Content Creation'],
        price: 399.00,
        countInStock: 8,
        rating: 4.9,
        numReviews: 25,
        isFeatured: true
    },
    {
        name: 'Elgato Stream Deck MK.2',
        image: '/images/products/stream-deck.png',
        description: '15 customizable LCD keys to control your apps and tools. The ultimate tool for streamers.',
        brand: 'Elgato',
        category: 'Accessories',
        niche: ['Streaming', 'Gaming'],
        price: 149.99,
        countInStock: 15,
        rating: 4.7,
        numReviews: 40,
        isFeatured: true
    },
    {
        name: 'Godox SL-60W LED Video Light',
        image: '/images/products/video-light.png',
        description: 'Powerful and quiet lighting setup for professional-looking videos.',
        brand: 'Godox',
        category: 'Lighting',
        niche: ['Content Creation', 'Dancing'],
        price: 139.00,
        countInStock: 10,
        rating: 4.6,
        numReviews: 18,
        isFeatured: false
    }
];

const importData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        await Product.deleteMany();
        await Order.deleteMany();
        await Product.insertMany(products);

        console.log('✅ Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error with data import: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        await Product.deleteMany();
        await User.deleteMany();
        await Order.deleteMany();

        console.log('🗑️ Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error with data destruction: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
