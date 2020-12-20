const _ = require("lodash");
const User = require("../models/User");
const formidable = require("formidable");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.Register = async function (req, res) {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (user)
      return res.status(400).json({
        message: {
          msgBody: "User with the email is already registered!",
          Error: true,
        },
      });

    user = new User({
      name,
      email,
      password,
      role: req.body.role,
    });
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    (user = _.pick(user, ["name", "email"])),
      res.status(200).json({
        user,
        message: {
          msgBody: "You have Successfully Registered!!",
          Error: false,
        },
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: {
        msgBody: "An Error Occured",
        Error: true,
      },
    });
  }
};
exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({
        message: {
          msgBody: "Invalid Email or Password",
          Error: true,
        },
      });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        message: {
          msgBody: "Invalid Email or Password. Please Register",
          Error: true,
        },
      });

    const token = user.genAuthToken();

    res.header("x-login-token", token).json({
      id: user._id,
      AccessToken: token,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: {
        msgBody: "An Error Occured",
        Error: true,
      },
    });
  }
};

exports.authUser = function (req, res, next) {
  const token = req.header("x-login-token");
  if (!token)
    return res.status(400).json({
      message: {
        msgBody: "No token provided",
      },
    });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
    req.user = decoded;

    next();
  } catch (err) {
    res.status(400).json({
      message: {
        msgBody: "Invalid token provided",
        Error: true,
      },
    });
  }
};

exports.isAdmin = (...role) => {
  return (req, res, next) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({
          message: {
            msgBody: "you are  not an Admin Go Away!",
            Error: true,
          },
        });
      }
      next();
    } catch (err) {
      res.status(403).json({
        message: {
          msgBody: "an Error occured",
          Error: true,
        },
      });
    }
  };
};

exports.authorized = async (req, res, next) => {
  console.log(req.user);
  if (req.user.id != req.profile._id) {
    console.log(req.user.id);
    console.log(req.profile._id);
    return res.status(403).json({
      message: { msgBody: "You are not allowed to perform this operation" },
    });
  }

  next();
};

exports.userById = async (req, res, next, id) => {
  const user = await User.findById(id).select("name email role");
  if (!user)
    return res
      .status(400)
      .json({ message: { msgBody: "No User Found", Error: true } });
  req.profile = user;
  next();
};

exports.allUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email role");

    res.status(200).json({ users });
  } catch (err) {
    return res.status(500).json({
      message: {
        msgBody: "An Error Occured",
        Error: true,
      },
    });
  }
};

exports.getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400).json({
      message: {
        msgBody: "User not found!",
        Error: true,
      },
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      id: updatedUser._id,
      AccessToken: updatedUser.genAuthToken(),
      name: updatedUser.name,

      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};
exports.updateUser = async (req, res) => {
  let id = req.params.userId;
  const user = await User.findById({ _id: id });

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role;

    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      id: updatedUser._id,
      AccessToken: updatedUser.genAuthToken(),
      name: updatedUser.name,

      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};

exports.userPhoto = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set(("Content-Type", req.profile.photo.contentType));
    return res.send(req.profile.photo.data);
  }
  next();
};

exports.deleteUser = async (req, res) => {
  try {
    let user = req.profile;
    const deletedUser = await user.remove();
    if (deletedUser)
      return res.status(200).json({
        message: {
          msgBody: "User has been deleted",
          Error: false,
        },
        deletedUser,
      });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ message: { msgBody: "An Error Occured", Error: true } });
  }
};
exports.getUser = (req, res) => {
  let user = req.profile;
  if (!user) {
    return res
      .status(400)
      .json({ message: { msgBody: " User Not Found", Error: true } });
  }
  res.json(user);
};
