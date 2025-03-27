const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const metData = [
    // Walking
    {exercise: 'walking', intensity: 'very slow', metValue: 2.0},
    {exercise: 'walking', intensity: 'slow', metValue: 2.8},
    {exercise: 'walking', intensity: 'moderate', metValue: 3.5},
    {exercise: 'walking', intensity: 'brisk', metValue: 4.3},
    {exercise: 'walking', intensity: 'very brisk', metValue: 5.0},

    // Running
    {exercise: 'running', intensity: '5 mph (8 km/h)', metValue: 8.3},
    {exercise: 'running', intensity: '6 mph (9.7 km/h)', metValue: 9.8},
    {exercise: 'running', intensity: '7 mph (11.3 km/h)', metValue: 11.0},
    {exercise: 'running', intensity: '8 mph (12.9 km/h)', metValue: 11.8},
    {exercise: 'running', intensity: '10 mph (16.1 km/h)', metValue: 14.5},

    // Cycling
    {exercise: 'cycling', intensity: 'leisure (10-12 mph)', metValue: 6.0},
    {exercise: 'cycling', intensity: 'moderate (12-14 mph)', metValue: 8.0},
    {exercise: 'cycling', intensity: 'vigorous (14-16 mph)', metValue: 10.0},
    {exercise: 'cycling', intensity: 'racing (>16 mph)', metValue: 12.0},

    // Swimming
    {exercise: 'swimming', intensity: 'leisure', metValue: 6.0},
    {exercise: 'swimming', intensity: 'moderate', metValue: 8.0},
    {exercise: 'swimming', intensity: 'vigorous', metValue: 10.0},

    // Aerobics
    {exercise: 'aerobics', intensity: 'low impact', metValue: 4.0},
    {exercise: 'aerobics', intensity: 'moderate', metValue: 6.5},
    {exercise: 'aerobics', intensity: 'high impact', metValue: 7.3},

    // Weight Training
    {exercise: 'weightlifting', intensity: 'light', metValue: 3.0},
    {exercise: 'weightlifting', intensity: 'moderate', metValue: 4.5},
    {exercise: 'weightlifting', intensity: 'vigorous', metValue: 6.0},

    // Yoga & Stretching
    {exercise: 'yoga', intensity: 'hatha', metValue: 2.5},
    {exercise: 'yoga', intensity: 'power', metValue: 4.0},
    {exercise: 'stretching', intensity: 'general', metValue: 2.3},

    // Sports
    {exercise: 'basketball', intensity: 'casual', metValue: 4.5},
    {exercise: 'basketball', intensity: 'competitive', metValue: 8.0},
    {exercise: 'soccer', intensity: 'casual', metValue: 7.0},
    {exercise: 'soccer', intensity: 'competitive', metValue: 10.0},
    {exercise: 'tennis', intensity: 'doubles', metValue: 5.0},
    {exercise: 'tennis', intensity: 'singles', metValue: 8.0},
    {exercise: 'jump rope', intensity: 'slow', metValue: 8.8},
    {exercise: 'jump rope', intensity: 'moderate', metValue: 11.8},
    {exercise: 'jump rope', intensity: 'fast', metValue: 12.3},
];


async function seedMETTable() {
    // Clean the table first
    await prisma.mETTable.deleteMany({});
    console.log('🧹 Cleared existing MET table entries');

    // Insert new data
    for (const entry of metData) {
        await prisma.mETTable.create({data: entry});
    }

    console.log('✅ MET table seeded successfully');
}


seedMETTable()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
