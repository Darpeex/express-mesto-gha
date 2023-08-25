/* eslint-disable consistent-return */ // чтобы не ругался на стрелочную функцию
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken (jwt)

const { NODE_ENV, JWT_SECRET } = process.env; // достали константы из .env

// вынесли ответ об ошибке в отдельную функцию
const handleAuthError = (res) => {
  res
    .status(401)
    .send({ message: 'Необходима авторизация' });
};

// функции достаёт jwt из заголовка убирая 'Bearer '
const extractBearerToken = (authorization) => authorization.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers; // из ответа получаем токен
  // проверяем есть ли он или начинается ли с Bearer (тип токена аутентификации)
  if (!authorization || !authorization.startsWith('Bearer')) {
    return handleAuthError(res);
  }
  // если с полученым токеном всё в порядке
  const token = extractBearerToken(authorization); // в переменную записывается только jwt
  let payload; // у let блочная область видимости, чтобы payload был виден снаружи объявляем до try

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'); // проверяем подпись токена и расшифровываем
  } catch (err) {
    return handleAuthError(res);
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
