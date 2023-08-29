/* eslint-disable consistent-return */ // чтобы не ругался на стрелочную функцию
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken (jwt)

const { NODE_ENV, JWT_SECRET } = process.env; // достали константы из .env - github не видит

// функция с ответом об ошибке
const handleAuthError = (res) => {
  res
    .status(401)
    .send({ message: 'Необходима авторизация' });
};

// функции достаёт jwt из заголовка убирая 'Bearer '
// const extractBearerToken = (authorization) => authorization.replace('Bearer ', '');

// функции достаёт jwt из заголовка убирая 'Bearer '
const extractJwtToken = (authorization) => authorization.replace('jwt=', '');

module.exports = (req, res, next) => {
  const authorization = req.headers.cookie; // из ответа получаем токен
  console.log(authorization);
  // проверяем есть ли он или начинается ли с Bearer || jwt (тип токена аутентификации)
  if (!authorization || !authorization.startsWith('jwt=')) {
    return handleAuthError(res);
  }
  // если с полученым токеном всё в порядке
  const token = extractJwtToken(authorization); // в переменную записывается только jwt
  console.log(` 2 ${token}`);
  let payload; // у let блочная область видимости, чтобы payload был виден снаружи объявляем до try

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'); // проверяем подпись токена и расшифровываем
  } catch (err) {
    return handleAuthError(res);
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
