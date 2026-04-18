'use strict';
require('dotenv').config();
const express = require('express');
const statsRoutes = require('./routes/stats.routes');
const { requestLogger } = require('./middleware/logger.middleware');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

// ── Core Middleware ──────────────────────────────────────────────────────────
app.use(express.json());

// ── Request Logger ──────────────────────────────────────────────────────────
app.use(requestLogger);

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/stats', statsRoutes);

// ── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'stats-service' }));

// ── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ── Global Error Handler ────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
