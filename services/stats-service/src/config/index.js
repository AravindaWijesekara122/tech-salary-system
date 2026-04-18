'use strict';

/**
 * Centralised configuration sourced from environment variables.
 */
module.exports = {
  port: process.env.PORT || 5005,
  salaryServiceUrl: process.env.SALARY_SERVICE_URL || 'http://salary-service:5002',
};
