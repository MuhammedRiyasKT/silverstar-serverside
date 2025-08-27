const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  hotelLat: { type: Number, required: true },
  hotelLon: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
