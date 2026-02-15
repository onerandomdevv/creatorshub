const express = require('express');
const router = express.Router();
const { getAnalyticsData } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin'), getAnalyticsData);

module.exports = router;
