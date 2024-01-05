const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chat');
const authentication = require('../middleware/auth');

router.get('',chatController.getChat);
router.post('/sendMessage',authentication.userAuthenticate,chatController.postMessage);

module.exports = router;