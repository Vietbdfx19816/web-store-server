const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, unique: true, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  fullName: { type: String },
  address: { type: String },
  phoneNumber: { type: String, required: true },
  icon: { type: String },
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  role: { type: String, default: 'User' },
});

module.exports = mongoose.model('User', userSchema);
