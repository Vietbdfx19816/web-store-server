const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sessionSchema = new Schema(
  {
    messages: [
      {
        username: {
          type: String,
          default: 'Guest', // default for not login user
        },
        role: {
          type: String,
          default: 'Guest', // default for not login user
        },
        message: {
          type: String,
          required: true,
        },
        createAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// data expires after 7 days
sessionSchema.index({ createAt: 1 }, { expires: '7d' });

module.exports = mongoose.model('Session', sessionSchema);
