const Product = require('../models/product');
const Order = require('../models/order');
const { updateCart } = require('../util/helper');
const { sendMail } = require('../util/email');

// module.exports.postCart = async (req, res, next) => {
//   const cart = req.body?.cart || { products: [], coupon: 0 };
//   const cartProducts = cart.products; // need validate

//   const idList = cartProducts.map(item => item._id);

//   try {
//     const products = await Product.find()
//       .in('_id', idList)
//       .select('_id name category price img1 in_stock')
//       .lean();

//     const cart = updateCart(cart, products);

//     res.status(200).json({ cart });
//   } catch (err) {
//     next(err);
//   }
// };

module.exports.checkOut = async (req, res, next) => {
  const { fullName, address, cart, email, phoneNumber } = req.body;
  const user = req.user;

  const cartProducts = cart?.products;

  if (!cartProducts || cartProducts.length === 0 || !fullName || !address) {
    const error = new Error('Bad request');
    error.status = 400;
    return next(error);
  }

  try {
    // update user data

    // query product data
    const idList = cartProducts.map(item => item._id);
    const products = await Product.find()
      .in('_id', idList)
      .select('_id name category price img1 in_stock')
      .lean();

    const newCart = updateCart(cart, products);

    // check out of stock product
    const outOfStock = cart.products.some(item => item.in_stock < item.amount);
    if (outOfStock) {
      const error = new Error('Out of stock!');
      error.status = 409;
      error.data = { cart: newCart }; // return cart with new in_stock number
      throw error;
    }

    // query for bulkWrite products
    const updateProducts = newCart.products.map(product => {
      return {
        updateOne: {
          filter: { _id: product._id },
          update: { $inc: { in_stock: -product.amount } },
        },
      };
    });

    // create new order
    const newOrder = new Order({
      user: user._id,
      products: newCart.products,
      totalPrice: newCart.total - newCart.coupon,
      phoneNumber,
      address,
      status: 'Chờ thanh toán',
      delivery: 'Chờ xác nhận',
    });

    // save
    const [, order] = await Promise.all([
      Product.bulkWrite(updateProducts),
      newOrder.save(),
    ]);

    // send mail
    sendMail({
      template: 'email.pug',
      templateVars: {
        fullName: fullName,
        address: address,
        phoneNumber: phoneNumber,
        products: newCart.products,
        total: newCart.total,
      },
      to: email,
      subject: `Order - ${order._id}`,
    });

    return res.status(201).json({ message: 'Order Created!' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports.getOrders = async (req, res, next) => {
  const user = req.user;

  try {
    const orders = await Order.find({ user: user._id })
      .lean()
      .populate('user', 'fullName _id');

    res.status(200).json({ orders });
  } catch (error) {
    next(error);
  }
};

module.exports.getOrder = async (req, res, next) => {
  const orderId = req.params.orderId;
  const userId = req.user._id;

  try {
    const order = await Order.findOne({ _id: orderId, user: userId })
      .lean()
      .populate('user', 'fullName _id phoneNumber address')
      .populate('products.product', '_id img1 name price');

    if (!order) {
      const error = new Error('Not Found!');
      error.status = 404;
      throw error;
    }

    res.status(200).json({ order });
  } catch (error) {
    next(error);
  }
};
