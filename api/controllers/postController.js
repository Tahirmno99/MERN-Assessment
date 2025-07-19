const Post = require("../../db/models/Post");
const Follow = require("../../db/models/Follow");


exports.deletePost = async (req, res) => {
  try {
  const postId = req.params.id; // commit this line before running test cases
  await Post.findByIdAndDelete(postId); // commit this line before running test cases
  // Temporary response for testing
  return res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};

exports.getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const followings = await Follow.find().select("following");
    const followingIds = followings.map((f) => f.following);

    const posts = await Post.aggregate([
      { $match: { author: { $in: followingIds } } },
      { $sort: { created: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorDetails",
        },
      },
      { $unwind: "$authorDetails" },
      {
        $project: {
          content: 1,
          created: 1,
          authorName: "$authorDetails.name",
        },
      },
    ]);

    res.json(posts);
  } catch (error) {
    console.error("Error in getFeed:", error);
    res.status(500).json({ message: "Failed to fetch feed" });
  }
};
