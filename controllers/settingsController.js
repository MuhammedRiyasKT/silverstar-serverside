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
        geofenceRadius: 50,
      });
    }
    res.json({
      success: true,
      data: {
        hotelLat: settings.hotelLat.toString(),
        hotelLon: settings.hotelLon.toString(),
        geofenceRadius: settings.geofenceRadius || 50,
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
    const { hotelLat, hotelLon, geofenceRadius } = req.body;
    console.log(hotelLat, hotelLon, geofenceRadius)
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        hotelLat: mongoose.Types.Decimal128.fromString(hotelLat.toString()),
        hotelLon: mongoose.Types.Decimal128.fromString(hotelLon.toString()),
        geofenceRadius: geofenceRadius || 50,
      });
    } else {
      settings.hotelLat = mongoose.Types.Decimal128.fromString(hotelLat.toString());
      settings.hotelLon = mongoose.Types.Decimal128.fromString(hotelLon.toString());
      settings.geofenceRadius = geofenceRadius || 50;
      await settings.save();
    }

    res.json({
      success: true,
      data: {
        hotelLat: settings.hotelLat.toString(),
        hotelLon: settings.hotelLon.toString(),
        geofenceRadius: settings.geofenceRadius,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getSettings, updateSettings };

