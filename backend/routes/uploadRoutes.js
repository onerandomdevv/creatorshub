const path = require('path');
const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../config/cloudinary');
const router = express.Router();

/**
 * Cloudinary storage configuration for product images
 * Images are automatically optimized and served via CDN
 */
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'creatorshub/products', // Organize images in Cloudinary folder
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], // Allowed image formats
    transformation: [
      { width: 1000, height: 1000, crop: 'limit' }, // Limit max dimensions
      { quality: 'auto' }, // Automatic quality optimization
      { fetch_format: 'auto' } // Automatic format selection (WebP when supported)
    ]
  }
});

// File filter to validate image types
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only! (jpg, jpeg, png, webp)'));
  }
}

// Configure multer with Cloudinary storage
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

// @desc    Upload single image to Cloudinary
// @route   POST /api/upload
// @access  Public (should be Private in production)
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Return the Cloudinary URL
    res.json({
      success: true,
      url: req.file.path, // Cloudinary URL
      publicId: req.file.filename // Cloudinary public ID (for deletion if needed)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/:publicId
// @access  Private/Admin
router.delete('/:publicId', async (req, res) => {
  try {
    const publicId = req.params.publicId;
    
    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(`creatorshub/products/${publicId}`);
    
    if (result.result === 'ok') {
      res.json({ success: true, message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
