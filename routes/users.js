const { celebrate, Joi } = require('celebrate'); // библиотека для валидации данных

const router = require('express').Router(); // создание нового экземпляра маршрутизатора вместо app
const {
  getUsers, getUserById, getUserInfo, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

router.get('/users', celebrate({ // валидируем заголовки
  headers: Joi.object().keys({ authorization: Joi.string().required() }).unknown(true),
}), getUsers); // возвращает всех пользователей

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({ authorization: Joi.string().required() }).unknown(true),
}), getUserById); // возвращает пользователя по _id

router.get('/users/me', celebrate({
  headers: Joi.object().keys({ authorization: Joi.string().required() }).unknown(true),
}), getUserInfo); // возвращает информацию о текущем пользователе

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUserInfo); // обновляет профиль

router.patch('/users/me/avatar', celebrate({
  body: Joi.object({
    avatar: Joi.string().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png').uri()
      .required(),
  }),

}), updateUserAvatar); // обновляет аватар

module.exports = router;
