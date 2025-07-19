const jwt = require("jsonwebtoken");
require("dotenv").config();

const USERS = {
  u1: { id: "u1", role: "user" },
  u2: { id: "u2", role: "admin" },
};

exports.login = (req, res) => {
  const { id } = req.body;
  const user = USERS[id];
  if (!user) return res.status(401).json({ error: "Invalid ID" });

    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });
  res.json({ token });
};
