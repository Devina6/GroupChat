const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chat');
const authentication = require('../middleware/auth');
const multerMiddleware = require('../middleware/multer');
const upload = multerMiddleware.multer.single('image');

router.get('',chatController.getChat);
router.post('/sendMessage',authentication.userAuthenticate,authentication.groupAuthenticate,upload,chatController.postMessage);
router.get('/allMessage',authentication.userAuthenticate,authentication.groupAuthenticate,chatController.getAllMessages);
router.get('/groups',authentication.userAuthenticate,chatController.getGroups);
router.post('/newGroup',authentication.userAuthenticate,chatController.newGroup);
router.get('/users',authentication.userAuthenticate, authentication.groupAuthenticate,chatController.userList);
router.post('/addMember',authentication.userAuthenticate,authentication.groupAuthenticate,chatController.newMember);
router.post('/latestMessage',authentication.userAuthenticate,authentication.groupAuthenticate,chatController.latestMessage);

module.exports = router;