const bcrypt = require("bcryptjs");
const userDb = require("../database/userDb");

// Modify user name
async function modifyUserInfo(userId, data) {
    const updateData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));

    await userDb.modifyUserInfo(userId, updateData);
}

// Update profile image
async function updateProfileImage(userId, imageUrl) {
    if (!imageUrl) throw new Error("Image URL is required.");
    await userDb.updateProfileImage(userId, imageUrl);
}

// Retrieve profile image
async function getProfileImage(userId) {
    const user = await userDb.getUserById(userId);
    return user.profilePicUrl || null;
}

// Modify password
async function modifyPassword(userId, newPassword) {
    if (!newPassword) throw new Error("New password is required.");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userDb.updatePassword(userId, hashedPassword);
}

// Retrieve user info
async function getUserInfo(userId) {
    return await userDb.getUserById(userId);
}

// Send friend request
async function sendFriendRequest(userId, friendEmail) {
    const friend = await userDb.getUserByEmail(friendEmail);
    if (!friend) throw new Error("Friend not found.");

    await userDb.createFriendRequest(userId, friend.id);
}

// View friend requests
async function getFriendRequests(userId) {
    return userDb.getFriendRequests(userId);
}

// Accept a friend request (updates status and ensures bidirectional friendship)
async function acceptFriendRequest(requestId) {
    await userDb.acceptFriendRequest(requestId);
}

// Remove friendship (deletes both directions)
async function removeFriendship(userId1, userId2) {
    await userDb.removeFriendship(userId1, userId2);
}


// View friend list
async function getFriendList(userId) {
    return userDb.getFriends(userId);
}

module.exports = {
    modifyUserInfo,
    updateProfileImage,
    getProfileImage,
    modifyPassword,
    getUserInfo,
    sendFriendRequest,
    getFriendRequests,
    acceptFriendRequest,
    getFriendList,
    removeFriendship,
};
