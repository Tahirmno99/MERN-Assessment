const express = require("express");
const router = express.Router();
const { deletePost, getFeed } = require("../controllers/postController");
const authorize = require("../middleware/authorize");

router.get("/", authorize(), getFeed);
router.delete("/:id", authorize(['admin']), deletePost);

module.exports = router;
