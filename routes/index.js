const router = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // библиотека для валидации данных
const { authorize, createUser } = require('../controllers/users');
const { NotFound } = require('../errors/not-found-err');
const auth = require('../middlewares/auth');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), authorize);

// авторизация
// router.use(auth);

router.use('/users', auth, require('./users'));
router.use('/movies', auth, require('./movies'));

router.use('*', auth, (req, res, next) => {
  next(new NotFound('Такой страницы не существует'));
});

module.exports = router;
