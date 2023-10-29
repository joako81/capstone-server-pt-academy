const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  email: {
    type: String,
    unique: true,
    required: [true, "Email is Required"],
  },
  password: String,
  role: String,
  active: Boolean,
  avatar: String,
});

module.exports = mongoose.model("User", UserSchema);
