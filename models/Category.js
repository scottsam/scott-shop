const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const CategorySchema = new mongoose.Schema({
  tag: {
    type: String,
    trim: true,
  },
  products: [{ type: ObjectId, ref: "Product" }],
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
