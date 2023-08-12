/* eslint-disable import/no-extraneous-dependencies */
const router = require('express').Router();
const { getCards, createCard, deleteCard } = require('../controllers/cards');

router.get('/cards', getCards); // возвращает все карточки
router.post('/cards', createCard); // создаёт карточку
router.delete('/cards/:cardId', deleteCard); // удаляет карточку по идентификатору

module.exports = router;
