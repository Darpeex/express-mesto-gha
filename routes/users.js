const router = require('express').Router(); // создание нового экземпляра маршрутизатора заместо app
const {
  getUsers, getUserById, getUserInfo, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers); // возвращает всех пользователей
router.get('/users/:userId', getUserById); // возвращает пользователя по _id
router.get('/users/me', getUserInfo); // возвращает информацию о текущем пользователе
router.patch('/users/me', updateUserInfo); // обновляет профиль
router.patch('/users/me/avatar', updateUserAvatar); // обновляет аватар

module.exports = router;
