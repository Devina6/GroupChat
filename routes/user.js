const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

router.get('/home',userController.gethomePage);
router.get('',userController.geterrorPage);

router.get('/signup',userController.getsignup);
router.post('/adduser',userController.postsignup);

router.get('/login',userController.getlogin)
router.post('/login',userController.postlogin);

module.exports = router;