const express = require('express');
const router = express.Router();

const controller = require('../../backend/controllers/chargesby')

router.get('/:op_ID?/:date_from?/:date_to?/:format?', controller.get);

module.exports = router;