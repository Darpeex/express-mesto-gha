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
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// обновляет профиль
module.exports.updateUserInfo = (req, res) => {
  const { id } = req.user._id;
  const updatedFields = req.body;

  User.updateOne({ _id: id }, updatedFields)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

// обновляет аватар
module.exports.updateUserAvatar = (req, res) => {
  const { id } = req.user._id;
  const updatedAvatar = req.body.avatar;

  User.updateOne({ _id: id }, updatedAvatar)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
