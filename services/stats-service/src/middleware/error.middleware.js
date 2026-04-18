'use strict';

/**
 * Global error handler.
 * Catches errors forwarded via next(err) throughout the app.
 */
const errorHandler = (err, req, res, _next) => {
  console.error(
    `[ERROR] ${req.method} ${req.originalUrl} — ${err.message}`,
    err.stack
  );

  // If the error came from an upstream microservice (axios), forward its status
  if (err.response) {
    const status = err.response.status || 502;
    const message =
      err.response.data?.error ||
      err.response.data?.message ||
      'Upstream service error';
    return res.status(status).json({ error: message });
  }

  // Connection errors to upstream services
  if (err.code === 'ECONNREFUSED' || err.code === 'ECONNABORTED') {
    return res
      .status(503)
      .json({ error: 'Salary Service is unavailable. Please try again later.' });
  }

  const status = err.status || err.statusCode || 500;
  return res.status(status).json({ error: err.message || 'Internal server error' });
};

module.exports = { errorHandler };
