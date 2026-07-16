import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import * as yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';

import authRoutes from './routes/auth.routes.js';
import leadRoutes from './routes/lead.routes.js';
import userRoutes from './routes/user.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import followupRoutes from './routes/followup.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { sanitize } from './middleware/sanitize.middleware.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const swaggerDoc = yaml.load(readFileSync(resolve(__dirname, '../../docs/openapi.yaml'), 'utf8')) as object;

const app: Application = express();

// Security headers
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Auth rate limiting
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many requests, please try again later.' },
}));

// Logging & parsing
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Input sanitization (XSS protection)
app.use(sanitize);

// Swagger docs
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/followups', followupRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Atlantic AI CRM API is running!' });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
