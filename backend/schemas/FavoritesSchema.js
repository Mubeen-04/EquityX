const { Schema } = require("mongoose");

const FavoritesSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  stockName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create compound index to prevent duplicates per user
FavoritesSchema.index({ userId: 1, stockName: 1 }, { unique: true });

module.exports = { FavoritesSchema };
