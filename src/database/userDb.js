const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

// Update user name
async function modifyUserInfo(userId, updateData) {
    return prisma.user.update({
        where: {id: userId},
        data: updateData,
    });
}

// Update profile image
async function updateProfileImage(userId, imageUrl) {
    await prisma.user.update({
        where: {id: userId},
        data: {profilePicUrl: imageUrl},
    });
}

// Get user by ID
async function getUserById(userId) {
    return prisma.user.findUnique({
        where: {id: userId},
        select: {
            id: true,
            name: true,
            email: true,
            profilePicUrl: true,
            gender: true,
            dateOfBirth: true,
            weight: true,
        },
    });
}

// Get user by email
async function getUserByEmail(email) {
    return prisma.user.findUnique({where: {email}});
}

// Update password
async function updatePassword(userId, newPassword) {
    await prisma.user.update({
        where: {id: userId},
        data: {password: newPassword},
    });
}

// Create a friend request
async function createFriendRequest(userId, friendId) {
    await prisma.friend.create({
        data: {
            userId: userId,
            friendId: friendId,
            status: "pending",
        },
    });
}

// Get all friend requests for a user
async function getFriendRequests(userId) {
    return prisma.friend.findMany({
        where: {friendId: userId, status: "pending"},
        select: {
            id: true,
            user: {
                select: {name: true, email: true, profilePicUrl: true},
            },
        },
    });
}

// Accept a friend request and ensure bidirectional friendship
async function acceptFriendRequest(requestId) {
    // Fetch the friend request
    const request = await prisma.friend.findUnique({
        where: { id: requestId },
    });

    if (!request || request.status !== "pending") {
        throw new Error("Invalid or already accepted friend request.");
    }

    const { userId, friendId } = request;

    // Update the original request status to 'accepted'
    await prisma.friend.update({
        where: { id: requestId },
        data: { status: "accepted" },
    });

    // Add a reciprocal entry to ensure bidirectional friendship
    await prisma.friend.create({
        data: {
            userId: friendId,
            friendId: userId,
            status: "accepted",
        },
    });
}


// Get friend list
async function getFriends(userId) {
    return prisma.friend.findMany({
        where: {userId: userId, status: "accepted"},
        select: {
            friend: {select: {id: true, name: true, email: true, profilePicUrl: true}},
        },
    });
}

// Remove friendship in both directions
async function removeFriendship(userId1, userId2) {
    await prisma.friend.deleteMany({
        where: {
            OR: [
                { userId: userId1, friendId: userId2 },
                { userId: userId2, friendId: userId1 },
            ],
        },
    });
}

// Check if userId and friendId are confirmed friends
async function isFriend(userId, friendId) {
    const friendship = await prisma.friend.findFirst({
        where: {
            userId,
            friendId,
            status: "accepted",
        },
    });

    return !!friendship; // Return true if exists, false otherwise
}

// Get all confirmed friend IDs of the user
async function getFriendIds(userId) {
    const friends = await prisma.friend.findMany({
        where: {
            userId,
            status: "accepted",
        },
        select: {
            friendId: true,
        },
    });

    return friends.map(f => f.friendId);
}


module.exports = {
    modifyUserInfo,
    updateProfileImage,
    getUserById,
    getUserByEmail,
    updatePassword,
    createFriendRequest,
    getFriendRequests,
    acceptFriendRequest,
    getFriends,
    removeFriendship,
    isFriend,
    getFriendIds,
};
