/* eslint-disable consistent-return */ // убирает подчёркивание со стрелочной функции 'строка 33'
const Card = require('../models/card'); // импортируем модель

// возвращает все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards })) // успешно, возвращаем карточки
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' })); // или err.message
};

// создаёт карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => { // если введённые данные некорректны, возвращается ошибка с кодом '400'
      if (err.name === 'ValidationError') { // если тип ошибки совпадает с 'ValidationError'
        res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
      } else { // иначе, по-умолчанию, ошибка с кодом '500'
        res.status(500).send({ message: err.message });
      }
    });
};

// удаляет карточку по идентификатору
module.exports.deleteCard = (req, res) => {
  // req.params содержит параметры маршрута, которые передаются в URL
  const { cardId } = req.params; // извлекаем значение cardId из объекта req.params
  // runValidators проверяет поля перед сохранением в БД, new - возвращает обновленный документ
  const options = { runValidators: true, new: true };

  return Card.findByIdAndRemove({ _id: cardId }, options)
    .orFail(new Error('NotValidId'))
    .then(() => res.status(200).send({ message: 'Карточка успешно удалена' }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректный Id карточки' });
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
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректный Id карточки' });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
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
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректный Id карточки' });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};
