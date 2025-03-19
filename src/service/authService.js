const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authDb = require("../database/authDb");
require("dotenv").config();

// Register a new user
async function registerUser({ name, email, password, gender, dateOfBirth, weight }) {
    if (!name || !email || !password || !gender || !dateOfBirth || !weight) {
        throw new Error("All fields are required.");
    }

    weight = Number(weight);

    const hashedPassword = await bcrypt.hash(password, 10);
    await authDb.createUser(name, email, hashedPassword, gender, dateOfBirth, weight);
}

// Login user (returns JWT token)
async function loginUser({ email, password }) {
    if (!email || !password) {
        throw new Error("Email and password are required.");
    }

    const user = await authDb.getUserByEmail(email);
    if (!user) {
        throw new Error("User not found.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid password.");
    }

    // Generate JWT token
    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        jwt: token,  // Include token in response
    };
}

// Modify password (without old password check for now)
async function modifyPassword({ email, newPassword }) {
    if (!email || !newPassword) {
        throw new Error("Email and new password are required.");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await authDb.updatePassword(email, hashedNewPassword);
}

module.exports = { registerUser, loginUser, modifyPassword };
