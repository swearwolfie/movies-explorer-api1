// импорт экспресса и монго
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate'); // библиотека для валидации данных
const { DB_ADDRESS } = require('./config');

// создаем приложение
const app = express();
const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect(DB_ADDRESS, {
  autoIndex: true,
});

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// наш централизованный обработчик
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(err.statusCode)
    .send({
      message: statusCode === 500
        ? 'Произошла ошибка на сервере'
        : message,
    });
  next();
});

// запуск сервера
app.listen(PORT, () => {
  console.log(`HELLO ITS ME MARIO AT PORT ${PORT}`);
});
