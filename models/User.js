const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,

      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "root"],
      default: "root",
      required: true,
    },
  },
  { timestamps: true }
);

UserSchema.methods.genAuthToken = function () {
  const token = jwt.sign(
    { id: this._id, name: this.name, role: this.role },
    process.env.JWT_SECRETKEY,
    {
      expiresIn: "24h",
    }
  );
  return token;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
