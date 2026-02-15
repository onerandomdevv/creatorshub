const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    storeName: {
        type: String,
        default: 'Creators Hub'
    },
    supportEmail: {
        type: String,
        default: 'support@creatorshub.com'
    },
    currency: {
        type: String,
        default: 'USD',
        enum: ['USD', 'EUR', 'GBP', 'NGN']
    },
    shippingCost: {
        type: Number,
        default: 10.00
    },
    taxRate: {
        type: Number,
        default: 0.00
    },
    address: {
        type: String,
        default: '123 Creator Boulevard, Studio City, CA 90210'
    },
    socialMedia: {
        twitter: { type: String, default: 'https://twitter.com' },
        whatsapp: { type: String, default: 'https://whatsapp.com' },
        instagram: { type: String, default: 'https://instagram.com' },
        linkedin: { type: String, default: 'https://linkedin.com' },
        youtube: { type: String, default: 'https://youtube.com' }
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Singleton pattern: Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
    const settings = await this.findOne();
    if (settings) {
        return settings;
    }
    return await this.create({});
};

module.exports = mongoose.model('Settings', settingsSchema);
