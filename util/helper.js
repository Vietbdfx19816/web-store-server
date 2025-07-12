module.exports.updateCart = (cart, products) => {
  // add amount property to product
  const productList = cart.products;
  const coupon = cart.coupon;

  const newProducts = [];
  productList.forEach(product => {
    const [updateItem] = products.filter(
      item => item._id.toString() === product._id
    );
    if (updateItem) {
      newProducts.push({ product: { ...updateItem }, amount: product.amount });
    }
  });

  // re-calculate total
  const total = newProducts.reduce(
    (sum, item) => sum + item.product.price * item.amount,
    0
  );

  return { products: newProducts, total, coupon };
};
