const mongoose = require("mongoose");

const fcmTokenSchema = new mongoose.Schema({
  tableId: { type: String }, // user side
  role: { type: String, enum: ["admin", "user"], required: true },
  token: { type: String, required: true },
});

module.exports = mongoose.model("FcmToken", fcmTokenSchema);