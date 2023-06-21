const Movie = require('../models/movie');
const DefaultError = require('../errors/default-err');
const { created, success } = require('../utils/constants');
const NotFoundError = require('../errors/not-found-err');
// const ConflictError = require('../errors/confl-err');
const BadRequestError = require('../errors/bad-req-err');
const ForbiddenError = require('../errors/forbd-err');

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.create({ owner, ...req.body })
    .then((movie) => {
      res.status(created).send({ data: movie });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании фильма');
      } next(err);
    });
};

module.exports.getMovies = (req, res) => {
  Movie.find({})
    .then((movies) => res.status(success).send({ data: movies }))
    .catch(() => res.status(DefaultError).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  const { movieId } = req.params;

  Movie.findById(movieId)
    .then((movie) => {
      if (movie === null) {
        throw new NotFoundError('Фильм по указанному _id не найден.');
      }
      if (movie.owner.toString() !== owner) {
        throw new ForbiddenError('Нельзя удалить чужой фильм');
      } else {
        Movie.findByIdAndDelete(movieId)
          .then((film) => {
            res.status(success).send({ data: film });
          })
          .catch(next);
      }
    })
    .catch(next);
};
