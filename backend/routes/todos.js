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

router.post('/', async (req, res) => {
    const newTodo = new Todo({
        title: req.body.title,
        completed: req.body.completed
    });
    try {
        const savedTodo = await newTodo.save();
        res.status(201).json(savedTodo);
    } catch(err){
        res.status(500).json({message: err.message});
    }
})

router.put('/:id', async (req, res) => {
    try{
        const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.json(updatedTodo);
    } catch(err){
        res.status(500).json({message: err.message});
    }    
})

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