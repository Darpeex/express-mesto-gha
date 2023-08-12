const User = require('../models/user');

// возвращает всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' })); // или err.message
};

// возвращает пользователя по _id
module.exports.getUser = (req, res) => {
  const { ObjectId } = req.params;
  User.findById({ _id: ObjectId })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(404).send({ message: 'Пользователь не найден' });
      }
    }).catch((err) => res.status(500).send({ message: err.message }));
};

// создаёт пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send({ data: user });
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
      } else {
        res.status(500).send({ message: err.message });
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
        res.send({ data: user });
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
        res.send({ data: avatar });
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
