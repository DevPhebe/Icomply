require("./db/db_conn");
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/userRoute");
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.db_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const app = express();
const port = process.env.PORT || 5000;

// set view engine
app.set("view engine", "ejs");

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// listen for request
app.listen(port, () => {
  console.log(`server listening on ${port}`);
});


// route
app.get("/", (_req, res) => {
  res.render("index");
});

// app.get("/login", (_req, res) => {
//   res.render("login");
// });

// app.get("/signup", (_req, res) => {
//   res.render("signup");
// });

app.use(userRoute);

