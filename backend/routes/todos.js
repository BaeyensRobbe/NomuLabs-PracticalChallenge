const express = require('express');
const Todo = require('../models/Todo');
const router = express.Router();

//get all
router.get('/', async (req, res) => {
    try{
        const todos = await Todo.find();
        res.json(todos);
    } catch(err){
        res.status(500).json({message: err.message});
    }    
})

// add
router.post('/', async (req, res) => {
    const {title, completed, dueDate, priority} = req.body;
    if (dueDate && new Date(dueDate) < new Date().setHours(0, 0, 0, 0)) {
        return res.status(400).json({ error: 'Due date cannot be in the past' });
    }
    const newTodo = new Todo({
        title,
        completed,
        dueDate,
        priority
    });
    try {
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch(err){
        res.status(500).json({message: err.message});
    }
})

// update
router.put('/:id', async (req, res) => {
    const {title, completed, dueDate, priority} = req.body;
    if (dueDate && new Date(dueDate) < new Date().setHours(0, 0, 0, 0)) {
        return res.status(400).json({ error: 'Due date cannot be in the past' });
    }
    try{
        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, {title, completed, dueDate, priority}, {new: true});
        res.json(updatedTodo);
    } catch(err){
        res.status(500).json({message: err.message});
    }    
})


// delete
router.delete('/:id', async (req, res) => {
    try {
        const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json({ message: 'Todo deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;