'use strict';
const axios = require('axios');
const { salaryServiceUrl } = require('../config');

const client = axios.create({ baseURL: salaryServiceUrl, timeout: 30000 });

/**
 * Fetches all approved salary records from the Salary Service.
 * @returns {Promise<Array<{
 *   id: string,
 *   company: string,
 *   role: string,
 *   country: string,
 *   salaryAmount: number,
 *   experienceLevel: string,
 *   status: string
 * }>>}
 */
const getApprovedSalaries = async () => {
  const { data } = await client.get('/api/salaries/approved');
  return data;
};

module.exports = { getApprovedSalaries };
