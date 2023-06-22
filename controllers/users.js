const bcrypt = require('bcrypt'); // импортируем bcrypt для хэширования паролей
const token = require('jsonwebtoken'); // импортируем модуль jsonwebtoken для создания токена
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const { created, success } = require('../utils/constants');
const ConflictError = require('../errors/confl-err');
const BadRequestError = require('../errors/bad-req-err');
const { JWT_SECRET, NODE_ENV } = require('../config');

module.exports.createUser = (req, res, next) => {
  const
    {
      name,
      email,
      password,
    } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(created).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует, амиго'));
      } else next(err);
    });
};

module.exports.authorize = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password') // дополнение для оверрайда select'а в схеме
    .orFail(() => {
      next(new NotFoundError('Пользовать не найден'));
    })
    .then((user) => bcrypt.compare(password, user.password).then((matched) => {
      if (matched) {
        return user;
      } return next(new NotFoundError('Переданы некорректные данные')); // ошибка на несовпадение пароля
    }))
    .then((user) => {
      // создадим токен
      const jwt = token.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ jwt }); // вернём токен
    })
    .catch(next);
};

// users/me
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user === null) {
        next(new NotFoundError('Пользовать не найден'));
      }
      return res.status(success).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } return next(err);
    });
};

module.exports.changeUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user === null) {
        next(new NotFoundError('Пользовать не найден'));
      }
      return res.status(success).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные для обновления профиля'));
      } else next(err);
    });
};
