'use strict';
const { Router } = require('express');
const ctrl = require('../controllers/stats.controller');

const router = Router();

router.get('/overview',       ctrl.overview);
router.get('/by-role',        ctrl.byRole);
router.get('/by-country',     ctrl.byCountry);
router.get('/top-companies',  ctrl.topCompanies);
router.get('/percentiles',    ctrl.percentiles);

module.exports = router;
