const mongoose = require("mongoose");
const Settings = require("../models/Settings");

// Get settings
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        hotelLat: mongoose.Types.Decimal128.fromString("10.841156"),
        hotelLon: mongoose.Types.Decimal128.fromString("76.109505"),
      });
    }
    res.json({
      success: true,
      data: {
        hotelLat: settings.hotelLat.toString(),
        hotelLon: settings.hotelLon.toString(),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update settings
const updateSettings = async (req, res) => {
  try {
    const { hotelLat, hotelLon } = req.body;
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        hotelLat: mongoose.Types.Decimal128.fromString(hotelLat.toString()),
        hotelLon: mongoose.Types.Decimal128.fromString(hotelLon.toString()),
      });
    } else {
      settings.hotelLat = mongoose.Types.Decimal128.fromString(hotelLat.toString());
      settings.hotelLon = mongoose.Types.Decimal128.fromString(hotelLon.toString());
      await settings.save();
    }

    res.json({
      success: true,
      data: {
        hotelLat: settings.hotelLat.toString(),
        hotelLon: settings.hotelLon.toString(),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getSettings, updateSettings };

