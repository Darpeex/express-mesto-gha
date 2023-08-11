/* eslint-disable import/no-extraneous-dependencies */
const express = require('express');
const { getUsers, getUser, createUser } = require('../controllers/users');

const router = express.Router();

router.get('/users', getUsers); // возвращает всех пользователей
router.get('/users:userId', getUser); // возвращает пользователя по _id
router.post('/users', createUser); // создаёт пользователя

module.exports = router;
