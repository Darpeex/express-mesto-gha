/* eslint-disable object-curly-newline */ // откл. предупреждение о переносе с множеством аргументов
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const User = require('../models/user'); // импортируем модель

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
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10) // хешируем пароль
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.status(201).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Некорректные данные пользователя' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
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
