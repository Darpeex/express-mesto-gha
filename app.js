// const path = require('path');
const helmet = require('helmet'); // модуль для обеспечения безопасности приложения Express
const express = require('express'); // фреймворк для создания веб-приложений на Node.js
const mongoose = require('mongoose'); // модуль для работы с базой данных MongoDB
const { errors } = require('celebrate'); // мидлвэр для ошибок валидации полей
require('dotenv').config();

// импортируем контроллеры для создания пользователя и авторизации
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

// импорт маршрутов для пользователей и карточек:
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

// импорт валидаторов для роутов
const { signupValidator } = require('./validators/signup-validator');
const { signinValidator } = require('./validators/signin-validator');

// импорт экземпляра класса с ошибкой
const NotFoundError = require('./errors/not-found-err'); // 404

// импорт мидлвара для централизованной обработки ошибок
const errorHandler = require('./middlewares/error-handler');

const app = express(); // cоздаём объект приложения
const { PORT, BD_URL } = process.env; // свойство для доступа к переменным среды ОС из .env

app.use(helmet()); // использование модуля безопасности

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

mongoose.connect(BD_URL, { // подключение к mongodb
  useNewUrlParser: true, // обеспечивает совместимость с будущими версиями MongoDB
}).then(() => console.log('Подключились к БД'));

// роуты, не требующие авторизации
app.post('/signup', signupValidator, createUser); // регистрируемся
app.post('/signin', signinValidator, login); // заходим под пользователя

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use(userRouter);
app.use(cardRouter);

// обработчик ошибок celebrate
app.use(errors());

app.use((req, res, next) => { // предупреждаем переход по отсутсвующему пути
  next(new NotFoundError('Путь не найден'));
});

// наш централизованный обработчик
app.use(errorHandler);

// app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log(`Порт приложения: ${PORT}`);
});
