// scripts/food/seedFoodTables.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ingredientData = require('./ingredientData');
const foodData = require('./foodData');

async function seedFoodTables() {
    await prisma.food.deleteMany();
    await prisma.ingredient.deleteMany();
    console.log('🧹 Cleaned food and ingredient tables');

    for (const ing of ingredientData) {
        await prisma.ingredient.create({ data: ing });
    }
    console.log('✅ Inserted ingredients');

    for (const food of foodData) {
        await prisma.food.create({
            data: {
                name: food.name,
                ingredients: JSON.stringify(food.ingredients),
            },
        });
    }
    console.log('✅ Inserted food entries');
}

seedFoodTables()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
