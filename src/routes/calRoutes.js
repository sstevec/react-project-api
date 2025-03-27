const express = require("express");
const calService = require("../service/calService");

const router = express.Router();

router.get('/exercise/list', async (req, res) => {
    try {
        const exercises = await calService.getUniqueExercises();
        res.json(exercises);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/exercise/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const results = await calService.getExerciseIntensities(name);
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/exercise', async (req, res) => {
    try {
        const { userId, customName, exercise, intensity, metValue, duration } = req.body;
        const result = await calService.logExerciseCalories(userId, customName, exercise, intensity, metValue, duration);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:userId/:id', async (req, res) => {
    try {
        const { userId, id } = req.params;
        await calService.deleteCalorieEntry(userId, id);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/exercise/:userId/:id', async (req, res) => {
    try {
        const { userId, id } = req.params;
        const { newName, newDetail } = req.body;
        const updated = await calService.updateExerciseCalorieEntry(userId, id, newName, newDetail);
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/exercise/:userId/date/:date', async (req, res) => {
    try {
        const { userId, date } = req.params;
        const entries = await calService.getExerciseEntriesByDate(userId, date);
        res.json({payload: entries});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/food/list', async (req, res) => {
    try {
        const foodList = await calService.getAllFoodNames();
        res.json(foodList);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/food/detail/:name', async (req, res) => {
    try {
        const foodName = req.params.name;
        const detail = await calService.getFoodIngredientDetail(foodName);
        res.json(detail);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/food', async (req, res) => {
    try {
        const { userId, customName, foodItems } = req.body;
        const result = await calService.recordFoodIntake(userId, customName, foodItems);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/food/:userId/:id', async (req, res) => {
    try {
        const { userId, id } = req.params;
        const { newName, newDetail } = req.body;
        const result = await calService.updateFoodIntakeEntry(userId, id, newName, newDetail);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/food/:userId/date/:date', async (req, res) => {
    try {
        const { userId, date } = req.params;
        const entries = await calService.getIntakeEntriesByDate(userId, date);
        res.json({payload: entries});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:userId/:id', async (req, res) => {
    try {
        const { userId, id } = req.params;
        const entry = await calService.getCalorieEntryById(userId, id);
        res.json(entry);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/summary/:userId/date/:date', async (req, res) => {
    try {
        const { userId, date } = req.params;
        const summary = await calService.getDailySummary(userId, date);
        res.json(summary);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/summary/:userId/range', async (req, res) => {
    try {
        const { userId } = req.params;
        const { start, end } = req.query;
        const summary = await calService.getRangeSummary(userId, start, end);
        res.json(summary);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/summary/:userId/range/daily', async (req, res) => {
    try {
        const { userId } = req.params;
        const { start, end } = req.query;
        const list = await calService.getDailySummaryList(userId, start, end);
        res.json(list);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;