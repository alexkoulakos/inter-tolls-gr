const express = require('express');
const router = express.Router();

const healthcheck = require('../../backend/controllers/healthcheck');
router.get('/healthcheck', healthcheck.get);

const passesreset = require('../../backend/controllers/resetpasses');
router.post('/resetpasses', passesreset.post);

const stationsreset = require('../../backend/controllers/resetstations');
router.post('/resetstations', stationsreset.post);

const vehiclesreset = require('../../backend/controllers/resetvehicles');
router.post('/resetvehicles', vehiclesreset.post);

const updatepasses = require('../../backend/controllers/passesupdate')
router.post('/passesupdate', updatepasses.post);

module.exports = router;