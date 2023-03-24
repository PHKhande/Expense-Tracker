const express = require('express');

const userSignUp = require('../controllers/userController');
const FPassword = require('../controllers/frgtPassController')
const authenticateUser = require('../authMiddleware/auth');

const router = express.Router();

router.post('/signup/user', userSignUp.signUp);

router.post('/login/user', userSignUp.login);

router.get('/user/info', authenticateUser.authenticate, userSignUp.getUserInfo);

router.post('/password/forgotpassword', FPassword.getResetEmailInfo);

router.get('/password/resetpassword/:resetId', FPassword.getResetlinkInfo);

router.post('/password/resetpassword/:resetId', FPassword.postResetPasswordInfo);

module.exports = router;