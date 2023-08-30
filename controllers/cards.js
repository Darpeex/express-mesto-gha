/* eslint-disable consistent-return */ // убирает подчёркивание со стрелочной функции 'строка 33'
const Card = require('../models/card'); // импортируем модель

// возвращает все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards })) // успешно, возвращаем карточки
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' })); // или err.message
};

// создаёт карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send(card))
    .catch((err) => { // если введённые данные некорректны, передаём сообщение об ошибке и код '400'
      if (err.name === 'ValidationError') {
        return next({ statusCode: 400, message: 'Переданы некорректные данные пользователя' });
      }
      return next(err); // иначе, передаём ошибку в централизованный обработчик
    });
};

// удаляет карточку по идентификатору
module.exports.deleteCard = (req, res, next) => {
  // req.params содержит параметры маршрута, которые передаются в URL
  const { cardId } = req.params; // извлекаем значение cardId из объекта req.params
  return Card.findById({ _id: cardId })
    .orFail(new Error('CardNotFound'))
    .then((card) => {
      const userId = req.user._id;
      const cardUserId = card.owner.toString();

      if (userId !== cardUserId) {
        return next({ statusCode: 403, message: 'Вы можете удалить только свою карточку' });
      }
      return Card.findByIdAndRemove({ _id: cardId })
        .then(() => res.status(200).send({ message: 'Карточка успешно удалена' }));
    })
    .catch((err) => {
      if (err.message === 'CardNotFound') {
        return next({ statusCode: 404, message: 'Карточка не найдена' });
      }
      if (err.name === 'CastError') {
        return next({ statusCode: 400, message: 'Некорректный Id карточки' });
      }
      return next(err); // передаём ошибку в централизованный обработчик
    });
};

// поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
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
        return next({ statusCode: 400, message: 'Некорректный Id карточки' });
      }
      return next(err); // передаём ошибку в централизованный обработчик
    });
};

// убрать лайк с карточки
module.exports.dislikeCard = (req, res, next) => {
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
        return next({ statusCode: 400, message: 'Некорректный Id карточки' });
      }
      return next(err); // передаём ошибку в централизованный обработчик
    });
};
