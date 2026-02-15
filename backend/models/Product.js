const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    image: {
        type: String,
        default: 'no-image.jpg'
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Cameras', 'Audio', 'Lighting', 'Accessories']
    },
    niche: {
        type: [String],
        required: [true, 'Please add at least one niche'],
        enum: ['Streaming', 'Gaming', 'Dancing', 'Content Creation']
    },
    brand: {
        type: String,
        required: [true, 'Please add a brand']
    },
    countInStock: {
        type: Number,
        required: [true, 'Please add stock count'],
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
