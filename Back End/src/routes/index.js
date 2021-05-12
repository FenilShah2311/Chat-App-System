const express = require('express');
const userMessagesRoute = require('./userMessages.route');
const router = express.Router();
router.use('/usermessages', userMessagesRoute);
module.exports = router;