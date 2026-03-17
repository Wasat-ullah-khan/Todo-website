const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const auth = require('../middleware/authMiddleware');

// Protect all routes
router.use(auth);

// Get all todos for current user
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user }).sort({ createdAt: -1 });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a todo for current user
router.post('/', async (req, res) => {
    const todo = new Todo({
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        user: req.user
    });

    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a todo (verify ownership)
router.put('/:id', async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id, user: req.user });
        if (!todo) return res.status(404).json({ message: 'Todo not found or unauthorized' });

        if (req.body.title != null) todo.title = req.body.title;
        if (req.body.description != null) todo.description = req.body.description;
        if (req.body.completed != null) todo.completed = req.body.completed;
        if (req.body.dueDate !== undefined) todo.dueDate = req.body.dueDate;

        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a todo (verify ownership)
router.delete('/:id', async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id, user: req.user });
        if (!todo) return res.status(404).json({ message: 'Todo not found or unauthorized' });

        await todo.deleteOne();
        res.json({ message: 'Todo deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
