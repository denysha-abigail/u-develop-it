// index.js will act as a central hub to put all of the routes together

const express = require('express');
const router = express.Router();

router.use(require('./candidateRoutes'));

module.exports = router;