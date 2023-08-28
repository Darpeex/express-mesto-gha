/* eslint-disable no-unused-vars */ // неиспользуемый next в 47 строке, я не знаю, нужен ли
// const path = require('path');
const helmet = require('helmet'); // модуль для обеспечения безопасности приложения Express
const express = require('express'); // фреймворк для создания веб-приложений на Node.js
const mongoose = require('mongoose'); // модуль для работы с базой данных MongoDB
const { celebrate, Joi } = require('celebrate'); // библиотека для валидации данных

require('dotenv').config();
const { errors } = require('celebrate'); // мидлвэр для ошибок валидации полей

// импортируем контроллеры для создания пользователя и авторизации
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

// импорт маршрутов для пользователей и карточек:
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const app = express(); // cоздаём объект приложения
const { // оставлено здесь для ТЕСТов
  PORT = 3000,
  BD_URL = 'mongodb://localhost:27017/mestodb',
} = process.env; // свойство для доступа к переменным среды ОС

app.use(helmet()); // использование модуля безопасности

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

mongoose.connect(BD_URL, { // подключение к mongodb
  useNewUrlParser: true, // обеспечивает совместимость с будущими версиями MongoDB
}).then(() => console.log('Подключились к БД'));

// роуты, не требующие авторизации
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().min(2).max(30).required()
      .email(),
    password: Joi.string().min(2).max(30).required(),
    name: Joi.string().default('Жак-Ив Кусто').min(2).max(30),
    about: Joi.string().default('Исследователь').min(2).max(30),
    avatar: Joi.string().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png').uri(),
  }),
}), createUser); // регистрируемся и создаём пользователя
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().min(2).max(30).required()
      .email(),
    password: Joi.string().min(2).max(30).required(),
  }),
  query: {
    token: Joi.string().token().required(),
  },
}), login); // заходим под пользователя

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use(userRouter);
app.use(cardRouter);

app.use((req, res) => { // предупреждаем переход по отсутсвующему пути
  res.status(404).json({ message: 'Путь не найден' });
});

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// наш централизованный обработчик
app.use((err, req, res, next) => { // здесь обрабатываем все ошибки
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({ // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

// app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log(`Порт приложения: ${PORT}`);
});
