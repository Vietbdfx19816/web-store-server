const Product = require('../models/product');

module.exports.getProducts = async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const perPage = 8;
  const category = req.query.category;
  const keyword = req.query.keyword;
  const sorting = req.query.sorting || 'asc';

  const queryCategory = category ? { category: category } : {};
  const queryKeyword = keyword ? { $text: { $search: keyword } } : {};

  try {
    const products = await Product.find()
      .and([queryCategory, queryKeyword])
      .sort({ price: sorting })
      .skip((page - 1) * perPage)
      .limit(perPage);
    res.status(200).json({ products, category, keyword, page, sorting });
  } catch (err) {
    next(err);
  }
};

module.exports.getProduct = async (req, res, next) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error('Not found!');
      error.status = 404;
      throw error;
    }

    const category = product.category;

    const related = await Product.find({ category: category })
      .ne('_id', productId)
      .limit(4);

    res.status(200).json({ product, related });
  } catch (err) {
    next(err);
  }
};
