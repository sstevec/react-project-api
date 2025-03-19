const express = require("express");
const competitionService = require("../service/competitionService");

const router = express.Router();

// Create a competition
router.post("/create", async (req, res) => {
    try {
        await competitionService.createCompetition(req.user.id, req.body);
        res.json({ message: "Success" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Retrieve competition info
router.get("/:competitionId", async (req, res) => {
    try {
        const competition = await competitionService.getCompetitionInfo(req.params.competitionId);
        res.json({ message: "Success", payload: competition });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Retrieve top 50 participants
router.get("/:competitionId/participants", async (req, res) => {
    try {
        const participants = await competitionService.getTopParticipants(req.params.competitionId);
        res.json({ message: "Success", payload: participants });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Join a competition
router.post("/:competitionId/join", async (req, res) => {
    try {
        await competitionService.joinCompetition(req.user.id, req.params.competitionId);
        res.json({ message: "Success" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update user progress in competition
router.post("/:competitionId/update-progress", async (req, res) => {
    try {
        await competitionService.updateUserProgress(req.user.id, req.params.competitionId, req.body.progress);
        res.json({ message: "Success" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Retrieve competitions created by a user (with pagination)
router.get("/user/created", async (req, res) => {
    try {
        const { page = 1 } = req.query;
        const competitions = await competitionService.getCreatedCompetitions(req.user.id, page);
        res.json({ message: "Success", payload: competitions });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Retrieve user progress and rank in a competition
router.get("/:competitionId/progress", async (req, res) => {
    try {
        const progressData = await competitionService.getUserProgress(req.user.id, req.params.competitionId);
        res.json({ message: "Success", payload: progressData });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
