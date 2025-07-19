const request = require("supertest");
const express = require("express");
const feedRoutes = require("../routes/feedRoutes");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use("/feed", feedRoutes);

const createToken = (role) =>
  jwt.sign({ id: "u2", role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
});

describe("DELETE /feed/:id", () => {
  it("should allow admin to delete post", async () => {
    const token = createToken("admin");
    const res = await request(app)
      .delete("/feed/123")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Post deleted");
  });

  it("should forbid normal user from deleting post", async () => {
    const token = createToken("user");
    const res = await request(app)
      .delete("/feed/123")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Forbidden");
  });

  it("should block missing token", async () => {
    const res = await request(app).delete("/feed/123");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Missing or invalid token");
  });
});
