/* eslint-disable consistent-return */ // убирает подчёркивание со стрелочной функции 'строка 33'
const mongoose = require('mongoose');
const Card = require('../models/card');

// возвращает все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' })); // или err.message
};

// создаёт карточку
module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id доступен

  const { name, link } = req.body;
  Card.create({ name, link })
    .then((card) => res.status(201).send({ data: card }))
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
  const { cardId } = req.params;
  const options = { runValidators: true, new: true };

  return Card.findByIdAndRemove({ _id: cardId }, options)
    .then((card) => {
      if (card === null) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      res.status(200).send({ message: 'Карточка успешно удалена' });
    })
    .catch(() => {
      if (!cardId || !mongoose.Types.ObjectId.isValid(cardId)) {
        return res.status(400).send({ message: 'Некорректный ID карточки' });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
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
      res.status(200).send({ message: 'Лайк поставлен' });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
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
      res.status(200).send({ message: 'Лайк удален' });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка сервера' }));
};
