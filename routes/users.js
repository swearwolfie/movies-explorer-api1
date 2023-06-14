const router = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // библиотека для валидации данных
const {
  changeUser,
  getCurrentUser,
} = require('../controllers/users');

router.get('/me', getCurrentUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), changeUser);

module.exports = router;
