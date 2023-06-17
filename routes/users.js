const router = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // библиотека для валидации данных
const {
  changeUser,
  getCurrentUser,
} = require('../controllers/users');

// запрос пользователя
router.get('/me', getCurrentUser);

// запрос на редактирование пользователя
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
}), changeUser);

module.exports = router;
