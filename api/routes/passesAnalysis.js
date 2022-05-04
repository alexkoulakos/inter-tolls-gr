const express = require('express');
const router = express.Router();

const controller = require('../../backend/controllers/passesanalysis')
router.get('/:op1_ID?/:op2_ID?/:date_from?/:date_to?/:format?', controller.get);

module.exports = router;