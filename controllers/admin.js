const path = require('path');

const { deleteFile } = require('../util/file');

const Product = require('../models/product');
const Order = require('../models/order');

module.exports.getProducts = async (req, res, next) => {
  const keyword = req.query.keyword || '';
  const regex = new RegExp(`${keyword}`, 'i');

  try {
    const products = await Product.where('name')
      .regex(regex)
      .select('_id name img1 price category')
      .lean();
    res.status(200).json({ products });
  } catch (err) {
    next(err);
  }
};

module.exports.getProduct = async (req, res, next) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId).lean();
    if (!product) {
      const error = new Error('Not Found!');
      error.status = 404;
      throw error;
    }

    res.status(200).json({ product });
  } catch (err) {
    next(err);
  }
};

module.exports.createProduct = async (req, res, next) => {
  const { name, category, short_desc, long_desc, price, in_stock } = req.body;
  const images = req.files;

  try {
    const newProduct = new Product({
      name,
      category,
      short_desc,
      long_desc,
      price,
      in_stock,
    });

    images.forEach((image, index) => {
      newProduct[`img${index + 1}`] = `images/${image.filename}`;
    });

    const product = await newProduct.save();

    res
      .status(200)
      .json({ product: product._doc, message: 'Product created!' });
  } catch (err) {
    // clean images when failed
    images.forEach(image => {
      deleteFile(image.path);
    });
    next(err);
  }
};

module.exports.editProduct = async (req, res, next) => {
  const { productId } = req.params;
  const { name, category, short_desc, long_desc, price, in_stock } = req.body;

  const updateData = {};
  if (name) {
    updateData.name = name;
  }
  if (category) {
    updateData.category = category;
  }
  if (short_desc) {
    updateData.short_desc = short_desc;
  }
  if (long_desc) {
    updateData.long_desc = long_desc;
  }
  if (price) {
    updateData.price = Number(price);
  }
  if (in_stock) {
    updateData.in_stock = Number(in_stock);
  }

  try {
    const editProduct = await Product.findByIdAndUpdate(productId, {
      $set: updateData,
    });
    if (!editProduct) {
      const error = new Error('Product update failed!');
      error.status = 400;
      throw error;
    }

    res.status(200).json({ message: 'Product updated!' });
  } catch (err) {
    next(err);
  }
};

module.exports.delProduct = async (req, res, next) => {
  const { productId } = req.params;
  if (!productId) {
    return res.status(400).json({ message: 'Bad Request!' });
  }
  try {
    const deleteProduct = await Product.findByIdAndRemove(productId);

    for (let i = 1; i < 6; i++) {
      const img = deleteProduct._doc[`img${i}`];
      if (img) {
        const imagePath = path.join(__dirname, '..', 'public', img);
        deleteFile(imagePath);
      }
    }

    res
      .status(200)
      .json({ message: 'Product deleted', product: deleteProduct._doc });
  } catch (err) {
    next(err);
  }
};

module.exports.getOrders = async (req, res, next) => {
  const sorting = req.query.sorting || 'asc';
  try {
    const orders = await Order.find()
      .sort({ updatedAt: sorting })
      .lean()
      .populate('user', '_id fullName address phoneNumber');

    res.status(200).json({ message: 'Success', orders });
  } catch (err) {
    next(err);
  }
};

module.exports.getOrder = async (req, res, next) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId)
      .lean()
      .populate('user', '_id fullName address phoneNumber')
      .populate('products.product', '_id name price img1 category');

    if (!order) {
      const error = new Error('Order not found!');
      error.status = 404;
      throw error;
    }

    res.status(200).json({ message: 'Success', order });
  } catch (err) {
    next(err);
  }
};
