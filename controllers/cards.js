/* eslint-disable consistent-return */ // убирает подчёркивание со стрелочной функции 'строка 33'
/* eslint-disable no-unused-vars */ // убирает подчёркивание с неиспользуемых свойств
const Card = require('../models/card');

// возвращает все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' })); // или err.message
};

// создаёт карточку
module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id доступен

  const { name, link } = req.body;
  Card.create({ name, link })
    .then((card) => res.send({ data: card }))
    .catch((err) => { // если введённые данные некорректны, возвращается ошибка с кодом '400'
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
      } else { // иначе, по-умолчанию, ошибка с кодом '500'
        res.status(500).send({ message: err.message });
      }
    });
};

// удаляет карточку по идентификатору
module.exports.deleteCard = (req, res) => {
  const { id } = req.body;

  Card.deleteOne({ _id: id })
    .then((result) => {
      if (result.deletedCount === 0) { // Проверка удаления карточки
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      res.send({ message: 'Карточка успешно удалена' });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// поставить лайк карточке
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      res.send({ message: 'Лайк поставлен' });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

// убрать лайк с карточки
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      res.send({ message: 'Лайк удален' });
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};
