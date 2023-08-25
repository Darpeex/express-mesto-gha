// const path = require('path');
const helmet = require('helmet'); // модуль для обеспечения безопасности приложения Express
const express = require('express'); // фреймворк для создания веб-приложений на Node.js
const mongoose = require('mongoose'); // модуль для работы с базой данных MongoDB

require('dotenv').config();

// импортируем контроллеры для создания пользователя и авторизации
const { createUser, login } = require('./controllers/users');

// импорт маршрутов для пользователей и карточек:
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const app = express(); // cоздаём объект приложения
const { // задаём постоянные для удобства использования
  PORT = 3000,
  BD_URL = 'mongodb://localhost:27017/mestodb',
} = process.env; // свойство для доступа к переменным среды ОС

app.use(helmet()); // использование модуля безопасности

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

mongoose.connect(BD_URL, { // подключение к mongodb
  useNewUrlParser: true, // обеспечивает совместимость с будущими версиями MongoDB
}).then(() => console.log('Подключились к БД'));

app.use((req, res, next) => { // middleware с информацией о пользователей для дальнейших запросов
  req.user = {
    _id: '64d69b73ce1457bfc056584c', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

// подключаем роуты
app.post('/signup', createUser); // регистрируемся и создаём пользователя
app.post('/signin', login); // заходим под пользователя

app.use(userRouter);
app.use(cardRouter);

app.use((req, res) => { // предупреждаем переход по отсутсвующему пути
  res.status(404).json({ message: 'Путь не найден' });
});

// app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log(`Порт приложения: ${PORT}`);
});
