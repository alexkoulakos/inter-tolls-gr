const express = require('express');
const router = express.Router();

const controller = require('../../backend/controllers/availablestations')

router.get('/', controller.get);

module.exports = router;