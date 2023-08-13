/* eslint-disable no-unused-vars */ // подчёркивание всех неиспользуемых свойств (dotenv)
// const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const app = express();
const {
  PORT = 3000,
  BD_URL = 'mongodb://localhost:27017/mestodb',
} = process.env;

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

mongoose.connect(BD_URL, {
  useNewUrlParser: true,
}).then(() => console.log('Подключились к БД'));

app.use((req, res, next) => {
  req.user = {
    _id: '64d69b73ce1457bfc056584c', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

// подключаем роуты
app.use(userRouter);
app.use(cardRouter);

// app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log(`Порт приложения: ${PORT}`);
});
