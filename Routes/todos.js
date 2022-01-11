const express = require('express');
const User = require('../Models/User');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const JWT_SECRET = "AnShBaLaJiThAkUrIsAgOoDbOOY123123";
const router = express.Router();
const fetchuser = require('../Middlewares/fetchuser');
const jwt = require('jsonwebtoken');
const Todo = require('../Models/Todo');

// ROUTE 1: Get All the Todos using: GET "/api/todos/gettodos". Login required
router.get('/fetchalltodos', fetchuser, async (req, res) => {
    try {
        const notes = await Todo.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 2: Add a new Todo using: POST "/api/todos/addtodo". Login required
router.post('/addtodo', fetchuser, [
    body('desc', 'Description must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { desc } = req.body;

        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const todo = new Todo({
            desc, user: req.user.id
        });
        const savedTodo = await todo.save();

        res.json(savedTodo);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 2: Updating An existing Todo using: PUT "/api/todos/updatetodo/:id". Login required
router.put('/updatetodo/:id', fetchuser, async (req, res) => {
    const { desc } = req.body;
    try {
        // Create a newTodo object
        const newTodo = {};
        if (desc) { newTodo.desc = desc; };

        // Find the note to be updated and update it
        let todo = await Todo.findById(req.params.id);
        if (!todo) { return res.status(404).send("Not Found"); }

        if (todo.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // Saving The Updated Todo
        todo = await Todo.findByIdAndUpdate(req.params.id, { $set: newTodo }, { new: true });
        res.json({ todo });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 4: Delete an existing Todo using: DELETE "/api/notes/deletetodo". Login required
router.delete('/deletetodo/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be delete and delete it
        let todo = await Todo.findById(req.params.id);
        if (!todo) { return res.status(404).send("Not Found"); }

        // Allow deletion only if user owns this Todo
        if (todo.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // Deleting the Todo
        todo = await Todo.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Todo has been deleted", todo: todo });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
