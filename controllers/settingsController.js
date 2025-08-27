const Settings = require('../models/Settings');

const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ hotelLat: 10.841156, hotelLon: 76.109505 });
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { hotelLat, hotelLon } = req.body;
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ hotelLat, hotelLon });
    } else {
      settings.hotelLat = hotelLat;
      settings.hotelLon = hotelLon;
      await settings.save();
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getSettings, updateSettings };
