const express = require("express");
const router = express.Router();
const { saveFcmToken } = require("../controllers/fcmController");

// POST /api/save-fcm-token
router.post("/save-fcm-token", saveFcmToken);

module.exports = router;
