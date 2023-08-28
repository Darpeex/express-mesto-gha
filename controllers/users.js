/* eslint-disable consistent-return */ // откл. ругание на стрелочную функцию строка '103'
/* eslint-disable object-curly-newline */ // откл. предупреждение о переносе с множеством аргументов
const bcrypt = require('bcrypt'); // импортируем bcrypt
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken (jwt)
const User = require('../models/user'); // импортируем модель пользователя

// возвращает всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

// возвращает пользователя по _id
module.exports.getUserById = (req, res) => {
  // req.params содержит параметры маршрута, которые передаются в URL
  const { userId } = req.params;

  return User.findById({ _id: userId })
    .then((user) => {
      if (user === null) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') { // если тип ошибки совпадает с 'CastError'
        return res.status(400).send({ message: 'Некорректный Id пользователя' });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

// создаёт пользователя
module.exports.createUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .send({ message: 'Все поля должны быть заполнены' });
  }
  bcrypt.hash(password, 10, (error, hash) => { // хешируем пароль
    User.findOne({ email }).select('+password')
      .then((user) => {
        if (user) {
          return res
            .status(409)
            .send({ message: 'Даный email уже зарегистрирован' });
        }
        return User.create({ email, password: hash })
          .then((data) => { // колхоз получился, чтобы пароль не палился
            res
              .status(201)
              .send({
                name: data.name,
                about: data.about,
                avatar: data.avatar,
                email: data.email,
                password: data.password,
              });
          })
          .catch((err) => res.status(500).send(err));
      })
      .catch((err) => res.status(500).send({ message: `Произошла ошибка: ${err.message}` }));
  });
};

// обновляет профиль
module.exports.updateUserInfo = (req, res) => {
  const id = req.user._id; // извлекаем id пользователя из объекта req.user
  // runValidators проверяет поля перед сохранением в БД, new - возвращает обновленный документ
  const options = { runValidators: true, new: true }; // включена валидация и сразу обновление
  // req.body содержит обновленные данные профиля пользователя
  const updatedInfo = { name: req.body.name, about: req.body.about };

  return User.findByIdAndUpdate(id, updatedInfo, options) // передаём id и новые данные
    .then((user) => { // если обновление профиля выполнено успешно, выполнится след. блок
      if (user === null) { // если возвращенное значение user пустое, ошибка
        return res.status(404).send({ message: 'Пользователь не найден' });
      } // иначе отправим клиенту новые данные
      return res.status(200).send(user);
    }).catch((err) => { // если введённые данные некорректны, возвращается ошибка с кодом '400'
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
      } else { // иначе, по-умолчанию, ошибка с кодом '500'
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

// обновляет аватар
module.exports.updateUserAvatar = (req, res) => {
  const id = req.user._id;
  const options = { runValidators: true, new: true };
  const updatedAvatar = { avatar: req.body.avatar };

  return User.findByIdAndUpdate(id, updatedAvatar, options)
    .then((user) => { // если обновление профиля выполнено успешно, выполнится след. блок
      if (user === null) { // если возвращенное значение user пустое, ошибка
        return res.status(404).send({ message: 'Пользователь не найден' });
      } // иначе отправим клиенту новые данные
      return res.status(200).send(user);
    }).catch((err) => { // если введённые данные некорректны, возвращается ошибка с кодом '400'
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else { // иначе, по-умолчанию, ошибка с кодом '500'
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

// получение информации о пользователе
module.exports.getUserInfo = (req, res) => {
  const id = req.user._id;

  return User.find({ id })
    .then((user) => res.status(200).send({ user }))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

// проверка данных пользователя
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign( // создадим токен
        { _id: user._id }, // в строке ниже используем JWT_SECRET, если находимся в среде production
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', // а значение 'dev-secret', если находимся в другой среде (например, development)
        { expiresIn: '7d' }, // JWT создаётся сроком на неделю
      );
      res
        .cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }) // сохраняем токен в куки на неделю
        .send({ message: 'Успешная аутентификация' }) // отправляем ответ об успешной аутентификации
        .end(); // если у ответа нет тела, можно использовать метод end
    })
    .catch(() => { // ошибка аутентификации (присланный токен некорректен)
      res.status(401).send({ message: 'Ошибка аутентификации' });
    });
};
