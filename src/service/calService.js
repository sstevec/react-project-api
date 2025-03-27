const calDb = require('../database/calDb');

async function getUniqueExercises() {
    const all = await calDb.getAllExercises();
    return [...new Set(all.map(entry => entry.exercise))];
}

async function getExerciseIntensities(exerciseName) {
    return calDb.getIntensitiesForExercise(exerciseName);
}

async function logExerciseCalories(userId, customName, exercise, intensity, metValue, duration) {
    const user = await calDb.getUserWeight(userId);
    if (!user || !user.weight) throw new Error("User weight not found");

    const weight = user.weight;
    const calories = Math.round((metValue * 3.5 * weight * duration) / 200);

    const detail = {
        exercise,
        intensity,
        metValue,
        duration,
    };

    await calDb.recordCalorieEntry({
        userId,
        name: customName,
        type: 'exercise',
        detail: JSON.stringify(detail),
        calories,
    });

    return { calories };
}

async function deleteCalorieEntry(userId, id) {
    return calDb.deleteCalorieById(userId, id);
}


async function updateExerciseCalorieEntry(userId, id, newName, newDetail) {
    const user = await calDb.getUserWeight(userId);
    if (!user || !user.weight) throw new Error("User weight not found");

    const detail = typeof newDetail === 'string' ? JSON.parse(newDetail) : newDetail;
    const { metValue, duration } = detail;

    const calories = Math.round((metValue * 3.5 * user.weight * duration) / 200);

    return calDb.updateCalorieEntry(userId, id, {
        name: newName,
        detail: JSON.stringify(detail),
        calories,
    });
}


async function getExerciseEntriesByDate(userId, dateStr) {
    const start = new Date(dateStr);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return calDb.getEntriesByDate(userId, start, end);
}

async function getAllFoodNames() {
    return calDb.getAllFoodNames();
}

async function getFoodIngredientDetail(foodName) {
    const food = await calDb.getFoodByName(foodName);
    if (!food) return [];

    const ingredients = JSON.parse(food.ingredients); // { fat: 10, protein: 5 }
    const names = Object.keys(ingredients);

    const ingredientRecords = await calDb.getIngredientsByNameList(names);
    const calMap = {};
    ingredientRecords.forEach(i => calMap[i.name] = i.caloriePerGram);

    return names.map(name => ({
        name,
        amount: parseFloat(ingredients[name]),
        caloriePerGram: calMap[name] ?? 0,
    }));
}

function validateMealDetail(foodItems) {
    if (!Array.isArray(foodItems)) return [];

    return foodItems
        .filter(food => food.foodName && food.amount) // Only keep food items with name and amount
        .map(food => {
            const validIngredients = Array.isArray(food.ingredients)
                ? food.ingredients.filter(ing =>
                    ing.name && ing.amount != null && ing.caloriePerGram != null
                )
                : [];

            return {
                foodName: food.foodName,
                amount: parseFloat(food.amount),
                ingredients: validIngredients.map(ing => ({
                    name: ing.name,
                    amount: parseFloat(ing.amount),
                    caloriePerGram: parseFloat(ing.caloriePerGram),
                })),
            };
        })
        .filter(food => food.ingredients.length > 0); // Remove food items with no valid ingredients
}

function computeCal(detail){
    let totalCalories = 0;

    for (const food of detail) {
        const { amount, ingredients } = food;
        for (const ing of ingredients) {
            const grams = parseFloat(ing.amount);
            const calPerGram = parseFloat(ing.caloriePerGram) || 0;
            totalCalories += grams * calPerGram * amount;
        }
    }

    totalCalories = Math.round(totalCalories);
    return totalCalories;
}


async function recordFoodIntake(userId, customName, foodItems) {
    let detail = typeof foodItems === 'string' ? JSON.parse(foodItems) : foodItems;
    detail = validateMealDetail(detail)

    const totalCalories = computeCal(detail);

    await calDb.recordCalorieEntry({
        userId,
        name: customName,
        type: 'intake',
        detail: JSON.stringify(foodItems),
        calories: totalCalories,
    });

    return { calories: totalCalories };
}


async function updateFoodIntakeEntry(userId, id, newName, newDetail) {
    let detail = typeof newDetail === 'string' ? JSON.parse(newDetail) : newDetail;
    detail = validateMealDetail(detail)

    const totalCalories = computeCal(detail);

    return calDb.updateCalorieEntry(userId, id, {
        name: newName,
        detail: JSON.stringify(detail),
        calories: totalCalories,
    });
}


async function getIntakeEntriesByDate(userId, dateStr) {
    const start = new Date(dateStr);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    return calDb.getCalorieEntries({
        userId,
        type: 'intake',
        start,
        end,
    });
}

async function getCalorieEntryById(userId, id) {
    return calDb.getCalorieEntryById(userId, id);
}

async function getDailySummary(userId, dateStr) {
    const date = new Date(dateStr);
    const next = new Date(date);
    next.setDate(date.getDate() + 1);

    const entries = await calDb.getCalorieEntriesBetween(userId, date, next);

    let intake = 0, exercise = 0;
    for (const entry of entries) {
        if (entry.type === 'intake') intake += entry.calories;
        else if (entry.type === 'exercise') exercise += entry.calories;
    }

    return {
        date: dateStr,
        intake,
        exercise,
        net: intake - exercise,
    };
}

async function getRangeSummary(userId, startStr, endStr) {
    const start = new Date(startStr);
    const end = new Date(endStr);
    end.setDate(end.getDate() + 1); // make end inclusive

    const entries = await calDb.getCalorieEntriesBetween(userId, start, end);

    let intake = 0, exercise = 0;
    for (const entry of entries) {
        if (entry.type === 'intake') intake += entry.calories;
        else if (entry.type === 'exercise') exercise += entry.calories;
    }

    return {
        from: startStr,
        to: endStr,
        intake,
        exercise,
        net: intake - exercise,
    };
}

async function getDailySummaryList(userId, startStr, endStr) {
    const start = new Date(startStr);
    const end = new Date(endStr);
    end.setDate(end.getDate() + 1);

    const entries = await calDb.getCalorieEntriesBetween(userId, start, end);

    const dayMap = {};

    for (const entry of entries) {
        const dateKey = entry.createdAt.toISOString().split('T')[0];
        if (!dayMap[dateKey]) {
            dayMap[dateKey] = { intake: 0, exercise: 0 };
        }
        if (entry.type === 'intake') dayMap[dateKey].intake += entry.calories;
        if (entry.type === 'exercise') dayMap[dateKey].exercise += entry.calories;
    }

    const result = [];
    const cur = new Date(startStr);
    const last = new Date(endStr);

    while (cur <= last) {
        const key = cur.toISOString().split('T')[0];
        const intake = dayMap[key]?.intake || 0;
        const exercise = dayMap[key]?.exercise || 0;
        result.push({
            date: key,
            intake,
            exercise,
            net: intake - exercise,
        });
        cur.setDate(cur.getDate() + 1);
    }

    return result;
}



module.exports = {
    getUniqueExercises,
    getExerciseIntensities,
    logExerciseCalories,
    deleteCalorieEntry,
    updateExerciseCalorieEntry,
    getExerciseEntriesByDate,
    getAllFoodNames,
    getFoodIngredientDetail,
    recordFoodIntake,
    updateFoodIntakeEntry,
    getIntakeEntriesByDate,
    getCalorieEntryById,
    getDailySummary,
    getRangeSummary,
    getDailySummaryList
};