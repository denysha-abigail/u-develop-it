// index.js will act as a central hub to put all of the routes together

const express = require('express');
const router = express.Router();

router.use(require('./candidateRoutes'));
router.use(require('./partyRoutes'));
router.use(require('./voterRoutes'));

module.exports = router;