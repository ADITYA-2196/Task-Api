
const express = require('express');
const router = express.Router();
const { tasks } = require('../data/store');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', (req, res) => {
  const userTasks = tasks[req.username] || [];
  res.render('tasks', { tasks: userTasks, token: req.token });
});

router.post('/', (req, res) => {
  const { text } = req.body;
  const userTasks = tasks[req.username] || [];
  const task = { id: Date.now(), text };

  userTasks.push(task);
  tasks[req.username] = userTasks;

  res.redirect('/tasks?token=' + req.token);
});

router.post('/delete/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userTasks = tasks[req.username] || [];
  tasks[req.username] = userTasks.filter(task => task.id !== id);

  res.redirect('/tasks?token=' + req.token);
});

module.exports = router;
