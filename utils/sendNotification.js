const admin = require("../config/firebaseAdmin");

async function sendNotification(tokens, title, body) {
  if (!tokens || tokens.length === 0) return;

  const message = {
    notification: { title, body },
    tokens,
  };

  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log("✅ Notification sent:", response.successCount, "success,", response.failureCount, "failed");
  } catch (error) {
    console.error("❌ Notification error:", error);
  }
}

module.exports = sendNotification;