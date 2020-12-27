const Formidable = require("formidable");
const fs = require("fs");
const mongoose = require("mongoose");
const _ = require("lodash");

const Product = require("../models/Product");
const Category = require("../models/Category");

exports.productById = async (req, res, next, id) => {
  try {
    const product = await Product.findById(id).populate("category", "tag _id");

    if (!product)
      return res
        .status(400)
        .json({ message: { msgBody: "No Product Found", Error: true } });
    req.product = product;

    next();
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ message: { msgBody: "An Error Occured", Error: true } });
  }
};

exports.createProduct = async (req, res) => {
  let form = new Formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        message: { msgBody: "image could not be uploaded", Error: true },
      });
    }
    const {
      name,
      description,
      price,
      category,
      countInStock,
      numberOfReviews,
      brand,
      user,
    } = fields;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        message: { msgBody: "All fields are required", Error: true },
      });
    }

    let product = new Product(fields);
    product.user = req.user;

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          message: { msgBody: "image should be less than 1mb", Error: true },
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }
    await product.save();
    if (err || !product.category) {
      return res.status(400).json({
        message: {
          msgBody: "Cannot save product at this time or Invalid Category",
          Error: true,
        },
      });
    } else {
      res.json({
        message: {
          msgBody: "You have Successfully added a product",
          Error: false,
        },
        product,
      });

      let category = await Category.findById({ _id: product.category });
      category.products.push(product);
      await category.save();
    }
  });

  /*     const product = new product(req.body);
        //console.log("CREATING product: ", req.body);
        product.save()
            .then(result => {
                res.status(200).json({
                    product: result
                });
            }) */
};

exports.updateProduct = async (req, res, next) => {
  let form = new Formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "Photo could not be uploaded",
      });
    }
    // save product
    let product = req.product;
    product = _.extend(product, fields);
    product.updated = Date.now();

    if (files.photo) {
      if (files.photo.size > 1000000) {
        res.status(400).json({
          message: { msgBody: "image should be less than 1mb", Error: true },
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    await product.save();

    if (err) {
      return res.status(400).json({
        message: { msgBody: "Something went wrong", Error: true },
      });
    } else {
      res.json({
        message: { msgBody: "Product update successful", Error: false },
        product,
      });
    }
    console.log(typeof product.category);

    const category = await Category.findById({ _id: product.category });

    const arr = category.products;

    const uniqueobj = [
      ...new Map(arr.map((prod) => [prod._id, prod])).values(),
    ].push(product);
    await category.save();
  });
};

exports.getSingleProduct = async (req, res) => {
  let product = req.product;
  if (!product) {
    return res
      .status(400)
      .json({ message: { msgBody: " Product Not Found", Error: true } });
  }
  res.json({ product });
};

exports.productsByUser = async (req, res) => {
  try {
    const product = await Product.find({ merchant: req.profile._id })
      .populate("merchant", "_id name email phone ")
      .select("_id name description price category")
      .sort("_created");
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ message: { msgBody: "An Error Occured", Error: true } });
  }
};
exports.getAllProducts = async (req, res) => {
  try {
    const pageSize = 4;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};

    const count = await Product.countDocuments({ ...keyword });

    const products = await Product.find({ ...keyword })
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const pages = Math.ceil(count / pageSize);

    const response = { count, pages, page, products };

    res.status(200).send(response);
  } catch (err) {
    console.log(err);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    let id = req.params.productId;
    let product = req.product;
    console.log(product.category);

    const category = await Category.updateOne(
      { _id: product.category },
      { $pull: { products: id } }
    );

    const removedProduct = await product.remove();
    if (removedProduct)
      return res.status(200).json({
        message: {
          msgBody: "You have Successfully Deleted a Product!",
          Error: false,
        },
        removedProduct,
      });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ message: { msgBody: "An Error Occured", Error: true } });
  }
};

exports.productPhoto = (req, res) => {
  res.set(("Content-Type", req.product.photo.contentType));
  return res.send(req.product.photo.data);
};

exports.createProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  let id = req.params.productId;

  const product = await Product.findById({ _id: id });
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.name === req.user.name
    );

    if (alreadyReviewed) {
      res.status(400).json({
        message: { msgBody: "You have reviewd this product", Error: true },
      });
      return;
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      user: req.user.id,
      comment,
    };
    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
    product.rating = product.reviews.reduce(
      (acc, item) => item.rating + acc,
      0
    );
    await product.save();
    res
      .status(201)
      .json({ message: { msgBody: "Review added", Error: false }, product });
  } else {
    res
      .status(404)
      .json({ message: { msgBody: "Product not found", Error: true } });
  }
};

exports.getTopProducts = async (req, res) => {
  const products = await Product.find().sort({ rating: -1 }).limit(4);

  res.json(products);
};
exports.productByCategory = async (req, res) => {
  let id = req.params.categoryId;
  try {
    const product = await Product.find({ category: id }).populate(
      "category",
      "_id tag"
    );

    if (!product) {
      res
        .status(404)
        .json({ message: { msgBody: "Product not found", Error: true } });
    }
    res.json(product);
  } catch (err) {
    console.log(err);
  }
};
