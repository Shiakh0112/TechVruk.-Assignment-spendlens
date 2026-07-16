require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

const auditRoutes = require('./routes/audit');
const leadsRoutes = require('./routes/leads');
const summaryRoutes = require('./routes/summary');
const ogRoutes = require('./routes/og');

const app = express();

// Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

const ALLOWED_ORIGINS = [
  process.env.CLIENT_URL || 'http://localhost:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json({ limit: '50kb' }));

// CSRF protection for browser requests: validate Origin header on state-changing routes
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const origin = req.headers.origin;
    const referer = req.headers.referer;
    // Allow non-browser clients (no origin header)
    if (!origin && !referer) return next();
    const source = origin || (referer ? new URL(referer).origin : null);
    if (source && !ALLOWED_ORIGINS.includes(source)) {
      return res.status(403).json({ error: 'Forbidden: invalid origin.' });
    }
  }
  next();
});

// Global rate limiter: 100 requests per 15 min per IP
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false }));

app.use('/api/audit', auditRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/summary', summaryRoutes);
app.use('/api/og', ogRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

module.exports = app;
