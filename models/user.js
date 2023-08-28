/* eslint-disable func-names */ // чтобы не ругался на функцию строка '50'
const mongoose = require('mongoose'); // нужна для создании схем
const validator = require('validator'); // библиотека для валидации данных
const bcrypt = require('bcrypt'); // импортируем bcrypt для хеширования

// Создаём схему и задаём её поля
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // при не соответствии условиям в [] - выдаются ошибки
      default: 'Жак-Ив Кусто',
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (value) => validator.isURL(value),
        message: 'Некорректный URL',
      },
    },
    email: {
      type: String,
      required: [true, 'Поле "email" должно быть заполнено'],
      unique: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: 'Некорректный Email',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле "password" должно быть заполнено'],
      minlength: [8, 'Минимальная длина поля "password" - 8'],
      select: false, // чтобы API не возвращал хеш пароля
    },
  },
  { versionKey: false },
);

// добавим findUserByCredentials схеме пользователя; функция не стрелочная, т.к. нам нужен this
userSchema.statics.findUserByCredentials = function (email, password) {
  // попытаемся найти пользователя по почте
  return this.findOne({ email }) // this — это модель User
    .then((user) => {
      if (!user) { // если не нашёлся — отклоняем промис
        return Promise.reject(new Error('Неправильные почта или пароль'));
      } // нашёлся — сравниваем хеши
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { // если пароли не соответствуют - отклоняем промис
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user; // так user доступен
        });
    });
};

const User = mongoose.model('user', userSchema); // создание модели
module.exports = User; // экспорт модели
