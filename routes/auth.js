
const express = require('express');
const router = express.Router();
const { users } = require('../data/store');

function generateToken() {
  return Math.random().toString(36).substr(2);
}

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users[username]) return res.status(400).json({ message: 'User exists' });

  users[username] = { password, token: null };
  res.redirect('/auth/login');
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];

  if (!user || user.password !== password)
    return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken();
  user.token = token;
  res.redirect('/tasks?token=' + token);
});

module.exports = router;
