const { Schema } = require("mongoose");

const OrdersSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: String,
  qty: Number,
  price: Number,
  mode: String,
  status: {
    type: String,
    enum: ["pending", "executed", "cancelled", "rejected"],
    default: "pending"
  },
  paymentIntentId: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = { OrdersSchema };
