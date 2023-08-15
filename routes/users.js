const router = require('express').Router(); // создание нового экземпляра маршрутизатора заместо app
const {
  getUsers, getUserById, createUser, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

router.get('/users', getUsers); // возвращает всех пользователей
router.get('/users/:userId', getUserById); // возвращает пользователя по _id
router.post('/users', createUser); // создаёт пользователя
router.patch('/users/me', updateUserInfo); // обновляет профиль
router.patch('/users/me/avatar', updateUserAvatar); // обновляет аватар

module.exports = router;
