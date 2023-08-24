const mongoose = require('mongoose'); // нужна для создании схем
const validator = require('validator'); // библиотека для валидации данных
// const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken (jwt)

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
        message: 'Некорректный URL',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле "password" должно быть заполнено'],
      minlength: [8, 'Минимальная длина поля "password" - 8'],
    },
  },
  { versionKey: false },
);

const User = mongoose.model('user', userSchema); // создание модели
module.exports = User; // экспорт модели

// module.exports.login = (req, res) => {
//   const { email, password } = req.body;

//   return User.findUserByCredentials(email, password)
//     .then((user) => {
//       // создадим токен
//       const token = jwt.sign({ _id: user._id }, 'some-secret-key', {expiresIn: '7d'} );

//       // вернём токен
//       res.send({ token });
//     })
//     .catch((err) => {
//       res
//         .status(401)
//         .send({ message: err.message });
//     });
// };
