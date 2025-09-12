// const mongoose = require('mongoose');

// const settingsSchema = new mongoose.Schema({
//   hotelLat: { type: mongoose.Schema.Types.Decimal128, required: true },
//   hotelLon: { type: mongoose.Schema.Types.Decimal128, required: true },
// }, { timestamps: true });

// module.exports = mongoose.model('Settings', settingsSchema);

// D:\Silver-star-backend\models\Settings.js
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  hotelLat: { type: mongoose.Schema.Types.Decimal128, required: true },
  hotelLon: { type: mongoose.Schema.Types.Decimal128, required: true },
  geofenceRadius: { type: Number, default: 50 }, // meters
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);