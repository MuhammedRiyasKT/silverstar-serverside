const FcmToken = require("../models/FcmToken");

// @desc   Save FCM token
// @route  POST /api/save-fcm-token
// @access Public
const saveFcmToken = async (req, res) => {
  try {
    const { tableId, role, token } = req.body;
    console.log(`TableId : ${tableId} role : ${role} token : ${token}`)

    if (!role || !token) {
      return res.status(400).json({
        success: false,
        message: "Role and token required",
      });
    }

    await FcmToken.findOneAndUpdate(
      { token },                 // search by token
      { tableId, role, token },  // update data
      { upsert: true, new: true }
    );

    res.json({ success: true, message: "FCM Token saved" });
  } catch (error) {
    console.error("Save FCM Token Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { saveFcmToken };
