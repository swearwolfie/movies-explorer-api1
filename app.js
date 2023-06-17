// импорт экспресса и монго
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate'); // библиотека для валидации данных
const helmet = require('helmet');
// const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DB_ADDRESS } = require('./config');
const router = require('./routes');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

// создаем приложение
const app = express();
const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect(DB_ADDRESS, {
  autoIndex: true,
});

// запросы только с нашего сайта
// app.use(cors({ origin: 'http://localhost:3000' })); !!!!!!!!!!!!!!! ??

app.use(express.json()); // мидлвар переваривания информации
app.use(helmet()); // защита
app.use(requestLogger); // подключаем логгер запросов (в самом начале)

app.use(limiter); // подключаем rate-limiter
app.use(router); // роуты

// обработчики ошибок
app.use(errorLogger); // подключаем логгер ошибок (после всего, но перед ошибками)
app.use(errors()); // обработчик ошибок celebrate

const errorCode = require('./middlewares/errorCode'); // централизованный обработчик ошибок

app.use(errorCode);

// запуск сервера
app.listen(PORT, () => {
  console.log(`HELLO ITS ME MARIO AT PORT ${PORT}`);
});

//
/* {
  "name": "Kate Biship",
  "email": "katiekatie@gmail.com",
  "password": "1234567890"
} */

/*
{
  "name": "Miles Morales",
  "email": "babymiles@gmail.com",
  "password": "1234567890"
}
*/
