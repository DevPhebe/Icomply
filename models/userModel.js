const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: 'user'
    },
    verification_Token: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

// create user model
const User = mongoose.model("user", userSchema);
module.exports = User;
