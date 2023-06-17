const Movie = require('../models/movie');
const DefaultError = require('../errors/default-err');
const { created, success } = require('../utils/constants');
const NotFoundError = require('../errors/not-found-err');
// const ConflictError = require('../errors/confl-err');
const BadRequestError = require('../errors/bad-req-err');
const ForbiddenError = require('../errors/forbd-err');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    owner,
  })
    .then((movie) => res.status(created).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      }
      next(err);
    });
};

module.exports.getMovies = (req, res) => {
  Movie.find({})
    .then((movies) => res.status(success).send({ data: movies }))
    .catch(() => res.status(DefaultError).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.deleteMovie = (req, res, next) => {
  // console.log(req.params, 'isabella dances', req.params.movieID);
  // console.log(req.body, 'twisting like a rubiks cube', req.body.owner);
  Movie.findByIdAndDelete(req.params)
    .then((movie) => {
      if (movie === null) {
        next(new NotFoundError('Фильм по указанному _id не найден.'));
      }
      if (movie.owner.toString() !== req.user._id) {
        next(new ForbiddenError('Нельзя удалить чужой фильм'));
      }
      return res.status(success).send({ data: movie });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else next(err);
    });
};
