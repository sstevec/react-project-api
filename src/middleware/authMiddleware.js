const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

async function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided." });
    }

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from database
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, name: true, email: true }, // Only return necessary fields
        });

        if (!user) {
            return res.status(403).json({ message: "Forbidden: User does not exist." });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Forbidden: Invalid token." });
    }
}

module.exports = { authenticateToken };
