const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// In-memory storage
const users = {};       

// Utility: Generate token
function generateToken() {
  return Math.random().toString(36).substr(2);
}

// Middleware for auth
function authMiddleware(req, res, next) {
  const token = req.query.token || req.headers.authorization;
  const user = Object.entries(users).find(([, value]) => value.token === token);

  if (!user) return res.status(401).send('Unauthorized');
  req.username = user[0];
  req.token = token;
  next();
}

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/auth/register', (req, res) => {
  res.render('register');
});

app.post('/auth/register', (req, res) => {
  const { username, password } = req.body;
  if (users[username]) return res.status(400).send('User already exists');
  users[username] = { password, token: null };
  res.redirect('/auth/login');
});

app.get('/auth/login', (req, res) => {
  res.render('login');
});

app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user || user.password !== password) return res.status(401).send('Invalid credentials');

  const token = generateToken();
  user.token = token;
  res.redirect(`/tasks?token=${token}`);
});

app.get('/tasks', authMiddleware, (req, res) => {
  const userTasks = tasks[req.username] || [];
  res.render('tasks', { tasks: userTasks, token: req.token });
});

app.post('/tasks', authMiddleware, (req, res) => {
  const { text } = req.body;
  console.log(text);
  const userTasks = tasks[req.username] || [];
  const task = { id: Date.now(), text };

  userTasks.push(task);
  tasks[req.username] = userTasks;

  res.redirect(`/tasks?token=${req.token}`);
});

app.post('/tasks/delete/:id', authMiddleware, (req, res) => {
  const id = parseInt(req.params.id);
  const userTasks = tasks[req.username] || [];
  tasks[req.username] = userTasks.filter(task => task.id !== id);
  res.redirect(`/tasks?token=${req.token}`);
});

app.listen(3000, () => {
  console.log('Server running on 3000');
});
