const express = require("express");
const postService = require("../service/postService");
const upload = require("../util/uploadUtil");

const router = express.Router();

// Retrieve public posts (with pagination)
router.get("/public", async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const posts = await postService.getPublicPosts(parseInt(page));
        res.json({ message: "Success", payload: posts });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Retrieve friend posts (with pagination)
router.get("/friends", async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const posts = await postService.getFriendPosts(req.user.id, parseInt(page));
        res.json({ message: "Success", payload: posts });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Create a new post
router.post("/create", upload.single("postImage"), async (req, res) => {
    try {
        const { content, access } = req.body;
        const imageUrl = req.file ? req.file.path : null;
        await postService.createPost(req.user.id, content, imageUrl, access);
        res.json({ message: "Success" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Retrieve a user's posts (with pagination)
router.get("/user/:userId", async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const posts = await postService.getUserPosts(req.params.userId, parseInt(page));
        res.json({ message: "Success", payload: posts });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
