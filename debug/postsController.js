async function getSortedPosts(req, res) {
  try {
    const posts = await Posts.find().sort({ created: -1 }); // Use MongoDB sorting
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
