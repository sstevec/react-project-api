const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllExercises() {
    return prisma.mETTable.findMany({
        select: {exercise: true}
    });
}

async function getIntensitiesForExercise(exercise) {
    return prisma.mETTable.findMany({
        where: {exercise},
        select: {intensity: true, metValue: true}
    });
}

async function getUserWeight(userId) {
    return prisma.user.findUnique({
        where: {id: userId},
        select: {weight: true},
    });
}

async function recordCalorieEntry({userId, name, type, detail, calories}) {
    return prisma.calorie.create({
        data: {
            userId,
            name,
            type,
            detail,
            calories,
        },
    });
}

async function deleteCalorieById(userId, id) {
    return prisma.calorie.deleteMany({
        where: {id, userId}
    });
}

async function updateCalorieEntry(userId, id, {name, detail, calories}) {
    return prisma.calorie.updateMany({
        where: {id, userId},
        data: {name, detail, calories},
    });
}

async function getEntriesByDate(userId, start, end) {
    return prisma.calorie.findMany({
        where: {
            userId,
            type: 'exercise',
            createdAt: {
                gte: start,
                lt: end,
            },
        },
        orderBy: {
            createdAt: 'asc',
        }
    });
}

async function getAllFoodNames() {
    const result = await prisma.food.findMany({
        select: {name: true},
    });
    return result.map(f => f.name);
}

async function getFoodByName(name) {
    return prisma.food.findFirst({
        where: {name},
    });
}

async function getIngredientsByNameList(nameList) {
    return prisma.ingredient.findMany({
        where: {name: {in: nameList}},
    });
}

async function getCalorieEntries({userId, type, start, end}) {
    return prisma.calorie.findMany({
        where: {
            userId,
            type,
            createdAt: {
                gte: start,
                lt: end,
            },
        },
        orderBy: {
            createdAt: 'asc',
        }
    });
}

async function getCalorieEntryById(userId, id) {
    return prisma.calorie.findFirst({
        where: { id, userId },
    });
}

async function getCalorieEntriesBetween(userId, start, end) {
    return prisma.calorie.findMany({
        where: {
            userId,
            createdAt: {
                gte: start,
                lt: end,
            },
        },
    });
}


module.exports = {
    getAllExercises,
    getIntensitiesForExercise,
    getUserWeight,
    recordCalorieEntry,
    deleteCalorieById,
    updateCalorieEntry,
    getEntriesByDate,
    getAllFoodNames,
    getFoodByName,
    getIngredientsByNameList,
    getCalorieEntries,
    getCalorieEntryById,
    getCalorieEntriesBetween
};
