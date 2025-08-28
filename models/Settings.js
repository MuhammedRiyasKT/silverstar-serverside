const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  hotelLat: { type: mongoose.Schema.Types.Decimal128, required: true },
  hotelLon: { type: mongoose.Schema.Types.Decimal128, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);

