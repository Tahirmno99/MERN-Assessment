const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  author: String,
  content: String,
  created: Date,
});

module.exports = mongoose.model("Post", postSchema);
