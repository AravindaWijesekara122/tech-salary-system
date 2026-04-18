'use strict';
const { getApprovedSalaries } = require('../clients/salary.client');

// ─── Helper utilities ───────────────────────────────────────────────────────

/**
 * Calculate the median of a sorted numeric array.
 */
const calcMedian = (sorted) => {
  const n = sorted.length;
  if (n === 0) return 0;
  const mid = Math.floor(n / 2);
  return n % 2 === 1
    ? sorted[mid]
    : +((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2);
};

/**
 * Calculate a given percentile from a sorted numeric array.
 * Uses linear interpolation between nearest ranks.
 */
const calcPercentile = (sorted, p) => {
  if (sorted.length === 0) return 0;
  const rank = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(rank);
  const upper = Math.ceil(rank);
  if (lower === upper) return sorted[lower];
  const fraction = rank - lower;
  return +(sorted[lower] + fraction * (sorted[upper] - sorted[lower])).toFixed(2);
};

/**
 * Build a { count, average, median, min, max } summary from an array of amounts.
 */
const buildGroupStats = (amounts) => {
  if (amounts.length === 0) {
    return { count: 0, average: 0, median: 0, min: 0, max: 0 };
  }
  const sorted = [...amounts].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  return {
    count: sorted.length,
    average: +(sum / sorted.length).toFixed(2),
    median: calcMedian(sorted),
    min: sorted[0],
    max: sorted[sorted.length - 1],
  };
};

// ─── Public service functions ───────────────────────────────────────────────

/**
 * GET /stats/overview
 * Returns totalSubmissions, averageSalary, medianSalary.
 */
const getOverview = async () => {
  const salaries = await getApprovedSalaries();
  const amounts = salaries.map((s) => s.salaryAmount);

  if (amounts.length === 0) {
    return { totalSubmissions: 0, averageSalary: 0, medianSalary: 0 };
  }

  const sorted = [...amounts].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, v) => acc + v, 0);

  return {
    totalSubmissions: sorted.length,
    averageSalary: +(sum / sorted.length).toFixed(2),
    medianSalary: calcMedian(sorted),
  };
};

/**
 * GET /stats/by-role?role=...
 * Returns count, average, median, min, max for the given role.
 */
const getStatsByRole = async (role) => {
  const salaries = await getApprovedSalaries();
  const amounts = salaries
    .filter((s) => s.role.toLowerCase() === role.toLowerCase())
    .map((s) => s.salaryAmount);
  return buildGroupStats(amounts);
};

/**
 * GET /stats/by-country?country=...
 * Returns count, average, median, min, max for the given country.
 */
const getStatsByCountry = async (country) => {
  const salaries = await getApprovedSalaries();
  const amounts = salaries
    .filter((s) => s.country.toLowerCase() === country.toLowerCase())
    .map((s) => s.salaryAmount);
  return buildGroupStats(amounts);
};

/**
 * GET /stats/top-companies
 * Returns top 5 companies with the highest average salary.
 */
const getTopCompanies = async () => {
  const salaries = await getApprovedSalaries();

  if (salaries.length === 0) return [];

  // Group salaries by company (case-insensitive key)
  const groups = {};
  for (const s of salaries) {
    const key = s.company.toLowerCase();
    if (!groups[key]) groups[key] = { name: s.company, total: 0, count: 0 };
    groups[key].total += s.salaryAmount;
    groups[key].count += 1;
  }

  return Object.values(groups)
    .map((g) => ({
      companyName: g.name,
      averageSalary: +(g.total / g.count).toFixed(2),
    }))
    .sort((a, b) => b.averageSalary - a.averageSalary)
    .slice(0, 5);
};

/**
 * GET /stats/percentiles
 * Returns p50, p75, p90.
 */
const getPercentiles = async () => {
  const salaries = await getApprovedSalaries();
  const sorted = salaries.map((s) => s.salaryAmount).sort((a, b) => a - b);

  if (sorted.length === 0) return { p50: 0, p75: 0, p90: 0 };

  return {
    p50: calcPercentile(sorted, 50),
    p75: calcPercentile(sorted, 75),
    p90: calcPercentile(sorted, 90),
  };
};

module.exports = {
  getOverview,
  getStatsByRole,
  getStatsByCountry,
  getTopCompanies,
  getPercentiles,
};
