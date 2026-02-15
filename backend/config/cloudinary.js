const cloudinary = require('cloudinary').v2;

/**
 * Cloudinary configuration for cloud image storage
 * Provides automatic image optimization, CDN delivery, and transformations
 */

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test Cloudinary connection
const testCloudinaryConnection = async () => {
    try {
        const result = await cloudinary.api.ping();
        console.log('✅ Cloudinary connected successfully');
        return true;
    } catch (error) {
        console.error('❌ Cloudinary connection error:', error.message);
        return false;
    }
};

module.exports = {
    cloudinary,
    testCloudinaryConnection
};
