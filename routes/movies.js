const router = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // библиотека для валидации данных
const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movies');

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().regex(/^(https?:\/\/(www\.)?([a-zA-z0-9-]){1,}\.?([a-zA-z0-9]){2,8}(\/?([a-zA-z0-9-])*\/?)*\/?([-._~:/?#[]@!\$&'\(\)\*\+,;=])*)/).required,
  }),
}), createMovie);
router.get('/', getMovies);
router.delete('/:cardId', deleteMovie);

module.exports = router;
