const { celebrate, Joi } = require('celebrate'); // библиотека для валидации данных
const router = require('express').Router(); // создание нового экземпляра маршрутизатора вместо app

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards); // возвращает все карточки
router.post('/cards', celebrate({
  body: Joi.object().keys({ // создаёт карточку
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(/^(http|https):\/\/(www\.)?[a-zA-Z0-9\--._~:/?#[\]@!$&'()*+,;=]+#?$/),
  }),
}), createCard);
router.delete('/cards/:cardId', deleteCard); // удаляет карточку по идентификатору
router.put('/cards/:cardId/likes', likeCard); // поставить лайк карточке
router.delete('/cards/:cardId/likes', dislikeCard);// убрать лайк с карточки

module.exports = router;
