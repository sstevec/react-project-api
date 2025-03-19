const express = require("express");
const userService = require("../service/userService");
const upload = require("../util/uploadUtil");

const router = express.Router();

// Modify user name
router.post("/modify", async (req, res) => {
    try {
        const { name, gender, dateOfBirth, weight } = req.body;
        await userService.modifyUserInfo(req.user.id, { name, gender, dateOfBirth, weight });
        res.json({ message: "Success" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Upload profile image
router.post("/upload-profile", upload.single("profileImage"), async (req, res) => {
    try {
        await userService.updateProfileImage(req.user.id, req.file.path);
        res.json({ message: "Success" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Retrieve profile image URL
router.get("/profile-image", async (req, res) => {
    try {
        const imageUrl = await userService.getProfileImage(req.user.id);
        res.json({ message: "Success", payload: { imageUrl } });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Modify password
router.post("/modify-password", async (req, res) => {
    try {
        await userService.modifyPassword(req.user.id, req.body.newPassword);
        res.json({ message: "Success" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Retrieve user info
router.get("/info", async (req, res) => {
    try {
        const userInfo = await userService.getUserInfo(req.user.id);
        res.json({ message: "Success", payload: userInfo });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Send friend request
router.post("/send-friend-request", async (req, res) => {
    try {
        await userService.sendFriendRequest(req.user.id, req.body.friendEmail);
        res.json({ message: "Success" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// View all friend requests
router.get("/friend-requests", async (req, res) => {
    try {
        const requests = await userService.getFriendRequests(req.user.id);
        res.json({ message: "Success", payload: requests });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Accept a friend request
router.post("/accept-friend-request", async (req, res) => {
    try {
        await userService.acceptFriendRequest(req.body.requestId);
        res.json({ message: "Success" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Remove friendship
router.post("/remove-friendship", async (req, res) => {
    try {
        const { userId1, userId2 } = req.body;
        await userService.removeFriendship(userId1, userId2);
        res.json({ message: "Success" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// View friend list
router.get("/friends", async (req, res) => {
    try {
        const friends = await userService.getFriendList(req.user.id);
        res.json({ message: "Success", payload: friends });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
