const router = require('express').Router();

const controller = require('./assistant.controller');

router.post('/api/message', controller.processMessage);

module.exports = router;
