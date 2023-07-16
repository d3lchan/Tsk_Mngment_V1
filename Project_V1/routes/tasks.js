const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// Create a new task
router.post('/tasks', async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      completed: false
    });
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;