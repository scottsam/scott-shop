const express = require("express");
const app = express();

const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const fs = require("fs");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const path = require("path");

const usersRoute = require("./routes/users");
const productRoute = require("./routes/product");
const categoryRoute = require("./routes/category");
const orderRoute = require("./routes/order");

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Database Conected successfully...");
  }
);

//middleware
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 5000 })
);

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "client", "build")));

//app.use(cors());

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");

  next();
});

app.use("/", usersRoute);
app.use("/", productRoute);
app.use("/", categoryRoute);
app.use("/", orderRoute);

const port = process.env.PORT || 8000;

app.get("/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.listen(port, () => {
  console.log(`A NodeJS API on port: ${port}`);
});
