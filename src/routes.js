const express = require("express");
const { authenticateToken } = require("./middleware/authMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const calRoutes = require("./routes/calRoutes");
const competitionRoutes = require("./routes/competitionRoutes");

const router = express.Router();

// Auth routes (no authentication required)
router.use("/auth", authRoutes);

// Protected routes (JWT required)
router.use(authenticateToken);
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/calories", calRoutes);
router.use("/competitions", competitionRoutes);

module.exports = router;
