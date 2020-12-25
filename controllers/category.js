const Category = require("../models/Category");
const Product = require("../models/Product");

exports.categoryById = async (req, res, next, id) => {
  try {
    const category = await Category.findById(id).populate("products");

    if (!category) {
      return res
        .status(400)
        .json({ message: { msgBody: "No category Found", Error: true } });
    }

    req.category = category;
    next();
  } catch (err) {
    return res
      .status(400)
      .json({ message: { msgBody: "An Error Occured", Error: true } });
  }
};

exports.newCategory = async (req, res) => {
  let category = new Category(req.body);

  await category.save();
  res.json(category);
};

exports.getCategory = async (req, res) => {
  let category = req.Category;
  if (!category)
    return res.status(400).json({
      message: {
        msgBody: "no Category found",
        Error: true,
      },
    });
  res.json({ category });
};

exports.getAllCategories = async (req, res) => {
  const category = await Category.find();
  if (!category)
    return res.status(400).json({
      message: {
        msgBody: "no Category found",
        Error: true,
      },
    });
  return res.status(200).json(category);
};
