
const { users } = require('../data/store');

function authMiddleware(req, res, next) {
  const token = req.query.token || req.headers.authorization;
  const user = Object.entries(users).find(([, value]) => value.token === token);

  if (!user) return res.status(401).send('Unauthorized');

  req.username = user[0];
  req.token = token;
  next();
}

module.exports = authMiddleware;
