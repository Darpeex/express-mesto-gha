const { celebrate, Joi } = require('celebrate'); // библиотека для валидации данных
const router = require('express').Router(); // создание нового экземпляра маршрутизатора вместо app

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards); // возвращает все карточки
router.post('/cards', celebrate({
  body: Joi.object().keys({ // создаёт карточку
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().min(2).max(30).required()
      .pattern(/^(http|https):\/\/(www\.)?[a-zA-Z0-9\--._~:/?#[\]@!$&'()*+,;=]+#?$/),
  }),
}), createCard);
router.delete('/cards/:cardId', celebrate({ // удаляет карточку по идентификатору
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).required(),
  }),
}), deleteCard);
router.put('/cards/:cardId/likes', celebrate({ // поставить лайк карточке
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).required(),
  }),
}), likeCard);
router.delete('/cards/:cardId/likes', celebrate({ // убрать лайк с карточки
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).required(),
  }),
}), dislikeCard);

module.exports = router;
