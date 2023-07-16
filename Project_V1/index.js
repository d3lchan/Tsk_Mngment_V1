const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Task = require('../models/task');
const tasksRouter = require('./routes/tasks');  


app.use(express.json());
app.use(tasksRouter);

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// Update a task
router.put('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send();
    }
    task.title = req.body.title;
    task.description = req.body.description;
    task.dueDate = req.body.dueDate;
    task.completed = req.body.completed;
    await task.save();
    res.send(task);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;


// Login user
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send('Invalid email or password');
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).send('Invalid email or password');
    }
    req.session.user = user;
    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Logout user
router.post('/logout', async (req, res) => {
  try {
    req.session.destroy();
    res.send('User logged out');
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;

// Delete a task
router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// List all tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;