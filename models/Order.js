const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
    }
  ],
  status: {
    type: String,
    enum: ['pending', 'processing', 'delivered'],
    default: 'pending',
  },
  totalAmount: Number,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
