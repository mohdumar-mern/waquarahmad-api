import fetch from 'node-fetch';

// ✅ Recommended: Use environment variable for deployed URL
const SELF_URL = process.env.SELF_URL || "http://localhost:3000";

// ✅ Call this function in production only
export const keepAlive = () => {
  // Ping every 14 minutes
  setInterval(async () => {
    try {
      const res = await fetch(SELF_URL);
      console.log("Self-ping successful. Status:", res.status);
    } catch (err) {
      console.error("Self-ping error:", err.message);
    }
  }, 1000 * 60 * 9); // 9 minutes
};
