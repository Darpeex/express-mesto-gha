const { celebrate, Joi } = require('celebrate'); // библиотека для валидации данных
const router = require('express').Router(); // создание нового экземпляра маршрутизатора вместо app

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', celebrate({ // регистрируемся и создаём пользователя
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().min(2).max(30).required()
      .pattern(/^(http|https):\/\/(www\.)?[a-zA-Z0-9\--._~:/?#[\]@!$&'()*+,;=]+#?$/),
  }),
}), getCards); // возвращает все карточки
router.post('/cards', createCard); // создаёт карточку
router.delete('/cards/:cardId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).required(),
  }),
}), deleteCard); // удаляет карточку по идентификатору
router.put('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).required(),
  }),
}), likeCard); // поставить лайк карточке
router.delete('/cards/:cardId/likes', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).required(),
  }),
}), dislikeCard); // убрать лайк с карточки

module.exports = router;
