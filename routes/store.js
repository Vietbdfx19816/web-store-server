const express = require('express');

const router = express.Router();

const StoreController = require('../controllers/store');

router.get('/products', StoreController.getProducts);

router.get('/product/:productId', StoreController.getProduct);

module.exports = router;
