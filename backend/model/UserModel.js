const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    pan: {
      type: String,
    },
    balance: {
      type: Number,
      default: 100000, // Starting with ₹1,00,000
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
