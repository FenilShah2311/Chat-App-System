const express = require('express');
const userMessagesController = require('../controllers/userMessages.controller');
const router = express.Router();
router.post('/addEditUserMessages',(req, res) => userMessagesController.addEditUserMessages(req, res));

router.get('/getUserMessages/:start?/:limit?',(req, res) => userMessagesController.getUserMessages(req, res));

router.get('/getUsers',(req, res) => userMessagesController.getUsers(req, res));

module.exports = router;