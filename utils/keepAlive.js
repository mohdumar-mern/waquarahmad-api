import axios from "axios";

// For production, replace with your deployed frontend/backend URL
const SELF_URL = "http://localhost:3000"; // 🔁 change to your Render/Vercel URL

export const keepAlive = () => {
  setInterval(async () => {
    try {
      const res = await axios.get(SELF_URL);
      console.log("✅ Self-ping:", res.status);
    } catch (err) {
      console.error("❌ Self-ping error:", err.message);
    }
  }, 1000 * 60 * 9); // every 9 minutes
};
