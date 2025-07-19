const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: String,
  name: String,
  joined: Date,
});

module.exports = mongoose.model("User", userSchema);
