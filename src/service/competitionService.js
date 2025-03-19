const competitionDb = require("../database/competitionDb");
const userDb = require("../database/userDb");

// Create a competition
async function createCompetition(userId, { title, description, objective, rankMethod, startDate, endDate, access }) {
    if (!title || !description || !objective || !["ascending", "descending"].includes(rankMethod) || !["public", "friend_only"].includes(access)) {
        throw new Error("Invalid competition data.");
    }

    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start <= now) throw new Error("Start date must be in the future.");
    if (end <= start) throw new Error("End date must be after start date.");

    await competitionDb.createCompetition(userId, title, description, objective, rankMethod, start, end, access);
}

// Retrieve competition info
async function getCompetitionInfo(competitionId) {
    return await competitionDb.getCompetitionInfo(competitionId);
}

// Retrieve top 50 participants
async function getTopParticipants(competitionId) {
    return await competitionDb.getTopParticipants(competitionId);
}

// Join a competition
async function joinCompetition(userId, competitionId) {
    const competition = await competitionDb.getCompetitionInfo(competitionId);

    if (competition.access === "friend_only") {
        const isFriend = await userDb.isFriend(userId, competition.creatorId);
        if (!isFriend) throw new Error("This competition is friend-only. You are not friends with the creator.");
    }

    await competitionDb.joinCompetition(userId, competitionId);
}

// Update user progress in a competition
async function updateUserProgress(userId, competitionId, progress) {
    const competition = await competitionDb.getCompetitionInfo(competitionId);
    if (new Date() > new Date(competition.endDate)) {
        throw new Error("Competition has ended.");
    }

    await competitionDb.updateUserProgress(userId, competitionId, progress);
}

// Retrieve all competitions created by a user
async function getCreatedCompetitions(userId, page) {
    const parsedPage = parseInt(page) || 1; // Default to page 1 if invalid
    return competitionDb.getCreatedCompetitions(userId, parsedPage);
}


// Retrieve user progress and rank in a competition
async function getUserProgress(userId, competitionId) {
    return await competitionDb.getUserProgress(userId, competitionId);
}

module.exports = {
    createCompetition,
    getCompetitionInfo,
    getTopParticipants,
    joinCompetition,
    updateUserProgress,
    getCreatedCompetitions,
    getUserProgress,
};
