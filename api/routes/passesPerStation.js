const express = require('express');
const router = express.Router();

const controller = require('../../backend/controllers/passesperstation')
router.get('/:stationID?/:date_from?/:date_to?/:format?', controller.get);

module.exports = router;