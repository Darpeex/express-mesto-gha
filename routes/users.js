const { celebrate, Joi } = require('celebrate'); // библиотека для валидации данных
const router = require('express').Router(); // создание нового экземпляра маршрутизатора вместо app

const {
  getUsers, getUserById, getUserInfo, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers); // возвращает всех пользователей
router.get('/users/me', getUserInfo); // возвращает информацию о текущем пользователе
router.get('/users/:userId', celebrate({ // возвращает пользователя по _id
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24).required(),
  }),
}), getUserById);

router.patch( // обновляет профиль
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }).options({ abortEarly: false }),
  }),
  updateUserInfo,
);

router.patch( // обновляет аватар
  '/users/me/avatar',
  celebrate({
    body: Joi.object({
      avatar: Joi.string().uri().required()
        .pattern(/^(http|https):\/\/(www\.)?[a-zA-Z0-9\--._~:/?#[\]@!$&'()*+,;=]+#?$/),
    }).options({ abortEarly: false }),
  }),
  updateUserAvatar,
);

module.exports = router;
