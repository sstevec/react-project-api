const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

// Retrieve public posts (latest first)
async function getPublicPosts(page, limit) {
    return prisma.post.findMany({
        where: {access: "public"},
        include: {
            user: {select: {id: true, name: true, profilePicUrl: true}},
        },
        orderBy: {createdAt: "desc"},
        skip: (page - 1) * limit,
        take: limit,
    });
}

// Retrieve friend's posts
async function getFriendPosts(friendIds, page, limit) {
    return prisma.post.findMany({
        where: {userId: {in: friendIds}},
        include: {
            user: {select: {id: true, name: true, profilePicUrl: true}},
        },
        orderBy: {createdAt: "desc"},
        skip: (page - 1) * limit,
        take: limit,
    });
}

// Create a new post
async function createPost(userId, content, imageUrl, access) {
    await prisma.post.create({
        data: {
            userId,
            content,
            imageUrl,
            access,
        },
    });
}

// Retrieve a user's posts
async function getUserPosts(userId, page, limit) {
    return prisma.post.findMany({
        where: {userId},
        orderBy: {createdAt: "desc"},
        skip: (page - 1) * limit,
        take: limit,
    });
}

module.exports = {
    getPublicPosts,
    getFriendPosts,
    createPost,
    getUserPosts,
};
