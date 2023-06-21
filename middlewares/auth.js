// middlewares/auth.js
const token = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauth-err');
const { JWT_SECRET } = require('../config');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const jwt = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = token.verify(jwt, JWT_SECRET);
  //  req.user = payload;
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
