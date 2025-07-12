const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        amount: { type: Number, required: true, min: 1 },
      },
    ],
    phoneNumber: { type: Number, required: true },
    address: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String },
    delivery: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
