const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {type: String, required: true},
    completed: {type: Boolean, default: false},
    dueDate: {type: Date},
    priority: {type: String, enum: ['High', 'Medium', 'Low']}
});

module.exports = mongoose.model('Todo', todoSchema);