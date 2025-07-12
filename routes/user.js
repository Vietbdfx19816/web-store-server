const express = require('express');

const router = express.Router();
const { isAuth } = require('../middleware/is-auth');
const UserController = require('../controllers/user');

// path api/user/
// router.post('/cart', isAuth, UserController.postCart);

router.post('/order', isAuth, UserController.checkOut);

router.get('/orders', isAuth, UserController.getOrders);

router.get('/order/:orderId', isAuth, UserController.getOrder);

module.exports = router;
