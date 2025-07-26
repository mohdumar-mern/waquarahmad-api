import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';
import { keepAlive } from './utils/keepAlive.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
//   await redisClient.connect(); // already connected in redis.js, so optional
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    keepAlive()
  });
};

startServer();
