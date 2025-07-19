const mongoose = require("mongoose");

const followSchema = new mongoose.Schema({
  follower: String,
  following: String,
});

module.exports = mongoose.model("Follow", followSchema);
