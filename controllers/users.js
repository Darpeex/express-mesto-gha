const User = require('../models/user');

// возвращает всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

// возвращает пользователя по _id
module.exports.getUserById = (req, res) => {
  const { userId } = req.params;

  return User.findById({ _id: userId })
    .then((user) => {
      if (user === null) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};

// создаёт пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
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
  const { id } = req.user; // извлекаем id пользователя из объекта req.user
  const updatedFields = req.body; // req.body содержит обновленные данные профиля пользователя

  User.findByIdAndUpdate(id, updatedFields) // находим пользователя по id и передаём новые данные
    .then((user) => { // если обновление профиля выполнено успешно, выполнится след. блок
      if (user) { // если возвращенное значение user не пустое, отправим клиенту новые данные
        res.status(200).send({ data: user });
      } else { // иначе, вернём ошибку с кодом '404' и сообщением 'пользователь не найден'
        res.status(404).send({ message: 'Пользователь не найден' });
      } // обработчик ошибок во время выполнения операции
    }).catch((err) => { // если введённые данные некорректны, возвращается ошибка с кодом '400'
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
      } else { // иначе, по-умолчанию, ошибка с кодом '500'
        res.status(500).send({ message: err.message });
      }
    });
};

// обновляет аватар
module.exports.updateUserAvatar = (req, res) => {
  const { id } = req.user._id;
  const updatedField = req.body.avatar;

  User.updateOne({ _id: id }, updatedField)
    .then((avatar) => {
      if (avatar) {
        res.status(200).send({ data: avatar });
      } else {
        res.status(404).send({ message: 'Пользователь не найден' });
      }
    }).catch((err) => { // если введённые данные некорректны, возвращается ошибка с кодом '400'
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else { // иначе, по-умолчанию, ошибка с кодом '500'
        res.status(500).send({ message: err.message });
      }
    });
};
