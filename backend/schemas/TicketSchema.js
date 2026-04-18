const { Schema } = require("mongoose");

const TicketSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null, // Allow anonymous tickets from landing page
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "Account & KYC",
      "Deposits & Withdrawals",
      "Order Execution",
      "Brokerage & Charges",
      "Technical Issue",
      "Other",
    ],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "in-progress", "closed"],
    default: "open",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  response: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = { TicketSchema };
