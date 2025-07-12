const express = require('express');

const AdminController = require('../controllers/admin');

const { isAdmin, isAuth } = require('../middleware/is-auth');
const { multerFiles } = require('../middleware/multer-files');

const router = express.Router();

router.get('/products', isAuth, isAdmin, AdminController.getProducts);

router.get('/product/:productId', isAuth, isAdmin, AdminController.getProduct);

router.get('/orders', isAuth, isAdmin, AdminController.getOrders);

router.get('/order/:orderId', isAuth, isAdmin, AdminController.getOrder);

router.post(
  '/new/product',
  isAuth,
  isAdmin,
  multerFiles.array('images', 5),
  AdminController.createProduct
);

router.post(
  '/edit/product/:productId',
  isAuth,
  isAdmin,
  AdminController.editProduct
);

router.delete(
  '/product/:productId',
  isAuth,
  isAdmin,
  AdminController.delProduct
);

module.exports = router;
