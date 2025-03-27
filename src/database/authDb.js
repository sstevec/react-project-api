const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

// Create a new user
async function createUser(name, email, password, gender, dateOfBirth, weight) {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error("Email already exists.");
    }

    // Proceed with user creation
    return prisma.user.create({
        data: {
            name,
            email,
            password,
            gender,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            weight,
        },
    });
}

// Get user by email
async function getUserByEmail(email) {
    return prisma.user.findUnique({where: {email}});
}

// Update user password
async function updatePassword(email, newPassword) {
    const user = await prisma.user.findUnique({where: {email}});
    if (!user) {
        throw new Error("User not found.");
    }

    await prisma.user.update({
        where: {email},
        data: {password: newPassword},
    });
}

module.exports = {createUser, getUserByEmail, updatePassword};
