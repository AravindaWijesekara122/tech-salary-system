'use strict';
const statsService = require('../services/stats.service');

/**
 * GET /stats/overview
 */
const overview = async (req, res, next) => {
  try {
    const result = await statsService.getOverview();
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /stats/by-role?role=Software Engineer
 */
const byRole = async (req, res, next) => {
  try {
    const { role } = req.query;
    if (!role || !role.trim()) {
      return res.status(400).json({ error: "The 'role' query parameter is required." });
    }
    const result = await statsService.getStatsByRole(role.trim());
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /stats/by-country?country=Sri Lanka
 */
const byCountry = async (req, res, next) => {
  try {
    const { country } = req.query;
    if (!country || !country.trim()) {
      return res.status(400).json({ error: "The 'country' query parameter is required." });
    }
    const result = await statsService.getStatsByCountry(country.trim());
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /stats/top-companies
 */
const topCompanies = async (req, res, next) => {
  try {
    const result = await statsService.getTopCompanies();
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /stats/percentiles
 */
const percentiles = async (req, res, next) => {
  try {
    const result = await statsService.getPercentiles();
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { overview, byRole, byCountry, topCompanies, percentiles };
