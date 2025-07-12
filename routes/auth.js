const express = require('express');

const router = express.Router();

const AuthController = require('../controllers/auth');
const { isAuth, isSupport } = require('../middleware/is-auth');

router.post('/signup', AuthController.signUp);

router.get('/login', isAuth, AuthController.getLogin); // get user data with session store in client

router.post('/login', AuthController.postLogin);

router.get('/admin/login', isAuth, isSupport, AuthController.getAdminLogin);

router.post('/admin/login', AuthController.postAdminLogin);

router.get('/logout', AuthController.logOut);

module.exports = router;
