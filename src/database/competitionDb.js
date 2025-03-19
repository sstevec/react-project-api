const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Create a competition
async function createCompetition(creatorId, title, description, objective, rankMethod, startDate, endDate, access) {
    await prisma.competition.create({
        data: {
            creatorId,
            title,
            description,
            objective,
            rankMethod,
            startDate,
            endDate,
            access,
        },
    });
}

// Retrieve competition info
async function getCompetitionInfo(competitionId) {
    return prisma.competition.findUnique({
        where: {id: competitionId},
        include: {creator: {select: {id: true, name: true, profilePicUrl: true}}},
    });
}

// Retrieve top 50 participants based on competition rank method
async function getTopParticipants(competitionId) {
    // Fetch the competition to determine the rank method
    const competition = await prisma.competition.findUnique({
        where: { id: competitionId },
        select: { rankMethod: true },
    });

    if (!competition) {
        throw new Error("Competition not found.");
    }

    // Determine the sorting order based on the rank method
    const order = competition.rankMethod === "ascending" ? "asc" : "desc";

    return prisma.competitionParticipant.findMany({
        where: {competitionId},
        include: {user: {select: {id: true, name: true, profilePicUrl: true}}},
        orderBy: {progressData: order}, // Sort dynamically based on competition setting
        take: 50,
    });
}

// Join a competition
async function joinCompetition(userId, competitionId) {
    await prisma.competitionParticipant.create({ data: { userId, competitionId } });
}

// Update user progress in a competition
async function updateUserProgress(userId, competitionId, progress) {
    await prisma.competitionParticipant.update({
        where: { userId_competitionId: { userId, competitionId } },
        data: { progressData: progress },
    });
}

// Retrieve competitions created by a user with pagination
async function getCreatedCompetitions(userId, page = 1, limit = 10) {
    return prisma.competition.findMany({
        where: {creatorId: userId},
        orderBy: {createdAt: "desc"}, // Most recent competitions first
        skip: (page - 1) * limit,
        take: limit,
        select: {
            id: true,
            title: true,
            description: true,
            objective: true,
            rankMethod: true,
            startDate: true,
            endDate: true,
            access: true,
            createdAt: true,
        },
    });
}


// Retrieve user progress and rank in a competition
async function getUserProgress(userId, competitionId) {
    return prisma.competitionParticipant.findUnique({
        where: {userId_competitionId: {userId, competitionId}},
    });
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
