const express = require("express");
const authService = require("../service/authService");

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
    try {
        await authService.registerUser(req.body);
        res.status(201).json({ message: "Success" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login user
router.post("/login", async (req, res) => {
    try {
        const payload = await authService.loginUser(req.body);
        res.json({ message: "Success", payload });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

// Modify password
router.post("/modify-password", async (req, res) => {
    try {
        await authService.modifyPassword(req.body);
        res.json({ message: "Success" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
