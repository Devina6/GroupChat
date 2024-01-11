const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chat');
const authentication = require('../middleware/auth');

router.get('',chatController.getChat);
router.post('/sendMessage',authentication.userAuthenticate,authentication.groupAuthenticate,chatController.postMessage);
router.get('/allMessage',authentication.userAuthenticate,authentication.groupAuthenticate,chatController.getAllMessages);
router.get('/groups',authentication.userAuthenticate,chatController.getGroups);

module.exports = router;