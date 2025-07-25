const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  category: { type: String, required: true },
  img1: { type: String, required: true },
  img2: { type: String, required: true },
  img3: { type: String, required: true },
  img4: { type: String, required: true },
  long_desc: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  short_desc: { type: String, required: true },
  in_stock: { type: Number, required: true, min: 0 },
});

productSchema.index({ long_desc: 'text', short_desc: 'text' });

module.exports = mongoose.model('Product', productSchema);
