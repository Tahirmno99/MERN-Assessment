const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const feedRoutes = require("./routes/feedRoutes");
const { connectDB } = require("../db/config/connection");
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

app.use(cors({
  origin: CLIENT_URL,
  credentials: true, 
}));

app.use(express.json());

connectDB();

app.use("/api/login", authRoutes);
app.use("/api/feed", feedRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
