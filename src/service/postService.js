const postDb = require("../database/postDb");
const userDb = require("../database/userDb");

const POSTS_PER_PAGE = 10;

// Retrieve public posts (TODO: Implement recommendation algorithm)
async function getPublicPosts(page) {
    return postDb.getPublicPosts(page, POSTS_PER_PAGE);
}

// Retrieve friend posts (ignoring access control)
async function getFriendPosts(userId, page) {
    const friendIds = await userDb.getFriendIds(userId);
    return postDb.getFriendPosts(friendIds, page, POSTS_PER_PAGE);
}

// Create a new post
async function createPost(userId, content, imageUrl, access) {
    if (!content || !["public", "friend_only"].includes(access)) {
        throw new Error("Invalid post data.");
    }
    await postDb.createPost(userId, content, imageUrl, access);
}

// Retrieve a user's posts
async function getUserPosts(userId, page) {
    return postDb.getUserPosts(userId, page, POSTS_PER_PAGE);
}

module.exports = {
    getPublicPosts,
    getFriendPosts,
    createPost,
    getUserPosts,
};
