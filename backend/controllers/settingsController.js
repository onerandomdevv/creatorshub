const Settings = require('../models/Settings');

// @desc    Get store settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res) => {
    try {
        const settings = await Settings.getSettings();
        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Update store settings
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = async (req, res) => {
    try {
        let settings = await Settings.getSettings();
        
        settings.storeName = req.body.storeName || settings.storeName;
        settings.supportEmail = req.body.supportEmail || settings.supportEmail;
        settings.currency = req.body.currency || settings.currency;
        settings.address = req.body.address || settings.address;
        
        if (req.body.socialMedia) {
            settings.socialMedia = {
                ...settings.socialMedia,
                ...req.body.socialMedia
            };
        }
        
        settings.lastUpdatedBy = req.user._id;

        const updatedSettings = await settings.save();

        res.json({
            success: true,
            data: updatedSettings
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
