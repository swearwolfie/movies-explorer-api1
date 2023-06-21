const router = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // библиотека для валидации данных
const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movies');
// country, director, duration, year, description, image,
// trailer, nameRU, nameEN и thumbnail, movieId

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(2).max(30),
    director: Joi.string().min(2),
    duration: Joi.number(),
    year: Joi.string(),
    description: Joi.string().min(2).max(300),
    image: Joi.string().regex(/^(https?:\/\/(www\.)?([a-zA-z0-9-]){1,}\.?([a-zA-z0-9]){2,8}(\/?([a-zA-z0-9-])*\/?)*\/?([-._~:/?#[]@!\$&'\(\)\*\+,;=])*)/).required(),
    trailer: Joi.string().regex(/^(https?:\/\/(www\.)?([a-zA-z0-9-]){1,}\.?([a-zA-z0-9]){2,8}(\/?([a-zA-z0-9-])*\/?)*\/?([-._~:/?#[]@!\$&'\(\)\*\+,;=])*)/).required(),
    nameRU: Joi.string().min(2).max(60),
    nameEN: Joi.string().min(2).max(60),
    thumbnail: Joi.string().regex(/^(https?:\/\/(www\.)?([a-zA-z0-9-]){1,}\.?([a-zA-z0-9]){2,8}(\/?([a-zA-z0-9-])*\/?)*\/?([-._~:/?#[]@!\$&'\(\)\*\+,;=])*)/).required(),
    movieId: Joi.number(),
  }),
}), createMovie);
router.get('/', getMovies);
router.delete('/:movieId', deleteMovie);

module.exports = router;

/* */

/*
{
  "country": "USA",
  "director": " Joaquim Dos Santos, Kemp Powers and Justin K. Thompson",
  "duration": 140,
  "year": "2023",
  "description": "Miles Morales catapults across the Multiverse",
  "image": "https://www.acrossthespiderverse.movie/images/synopsis_poster.jpg",
  "trailer": "https://www.youtube.com/watch?v=cqGjhVJWtEg",
  "nameRU": "Человек-паук: Паутина вселенных",
  "nameEN": "Spider-Man: Across the Spider-Verse",
  "thumbnail": "https://upload.wikimedia.org/wikipedia/en/b/b4/Spider-Man-_Across_the_Spider-Verse_poster.jpg",
  "movieId": 7
}
*/
