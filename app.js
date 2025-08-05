import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { limiter } from './utils/limiter.js';

import { pageNotFound, errorHandling } from './middlewares/errorHandlerMiddleware.js';
// Routes
import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import profileRoutes from './routes/profileRoutes.js';

const app = express();

// Allowed frontend origin
const allowedOrigins = ['https://waquarahmad.vercel.app', 'http://localhost:3000']; // replace with your frontend domain

// Proper CORS setup
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(helmet());
app.use(cookieParser());
app.use(limiter);

// Routes
app.get('/', (req, res) => {
  res.send("Hey Animatorv...");
});
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/profile', profileRoutes);

// Page not found
app.use(pageNotFound);

// Error Handling middleware
app.use(errorHandling);

export default app;
