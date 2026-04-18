const mongoose = require("mongoose");
const { FavoritesSchema } = require("../schemas/FavoritesSchema");

const FavoritesModel = mongoose.model("Favorites", FavoritesSchema);

module.exports = { FavoritesModel };
