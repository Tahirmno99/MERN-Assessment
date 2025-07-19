const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const Follow = require("./models/Follow");

const connect = async () => {
  await mongoose.connect("mongodb://localhost:27017/socialNetwork");
  console.log("MongoDB connected");
};

const seed = async () => {
  await connect();

  await User.deleteMany({});
  await Post.deleteMany({});
  await Follow.deleteMany({});

  const users = Array.from({ length: 20 }, (_, i) => ({
    _id: `u${i + 1}`,
    name: `User${i + 1}`,
    joined: new Date(`2024-01-${(i + 1).toString().padStart(2, "0")}`)
  }));
  
  await User.insertMany(users);

  const follows = [
    { follower: "u1", following: "u2" },
    { follower: "u1", following: "u3" },
    { follower: "u2", following: "u4" },
    { follower: "u3", following: "u5" },
    { follower: "u4", following: "u1" },
    { follower: "u5", following: "u6" },
    { follower: "u6", following: "u1" },
    { follower: "u7", following: "u8" },
    { follower: "u8", following: "u9" },
    { follower: "u9", following: "u10" }
  ];
  await Follow.insertMany(follows);

  const posts = Array.from({ length: 20 }, (_, i) => ({
    author: `u${(i % 20) + 1}`,
    content: `This is post #${i + 1} by User${(i % 20) + 1}`,
    created: new Date(`2024-03-${(10 + (i % 10)).toString().padStart(2, "0")}T0${i % 10}:00:00Z`)
  }));
  await Post.insertMany(posts);

  console.log("Seed complete: 20 users, 10 follows, 20 posts inserted.");
  process.exit();
};

seed();
