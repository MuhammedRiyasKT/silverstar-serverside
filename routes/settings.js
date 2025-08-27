const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingsController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/settings
// @desc    Get current restaurant settings
// @access  Private (Admin only)
router.get('/', auth, getSettings);

// @route   PUT /api/settings
// @desc    Update restaurant settings (logo, location, contact, etc.)
// @access  Private (Admin only)
router.put('/', auth, updateSettings);

module.exports = router;
