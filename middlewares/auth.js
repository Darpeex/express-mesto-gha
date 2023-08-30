/* eslint-disable consistent-return */ // чтобы не ругался на стрелочную функцию
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken (jwt)

const { NODE_ENV, JWT_SECRET } = process.env; // достали константы из .env - github не видит

// класс с ответом об ошибке
class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

// функции достаёт jwt из заголовка убирая 'jwt= '
const extractJwtToken = (authorization) => authorization.replace('jwt=', '');

module.exports = (req, res, next) => {
  const authorization = req.headers.cookie; // из ответа получаем токен
  // проверяем есть ли он или начинается ли с jwt= (тип токена аутентификации)
  if (!authorization || !authorization.startsWith('jwt=')) {
    throw new AuthorizationError('Не получен токен из ответа');
  }
  // если с полученым токеном всё в порядке
  const token = extractJwtToken(authorization); // в переменную записывается только jwt
  let payload; // у let блочная область видимости, чтобы payload был виден снаружи объявляем до try

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'); // проверяем подпись токена и расшифровываем
    req.user = payload; // записываем пейлоуд в объект запроса
    next();
  } catch (err) {
    next(err);
  }
};
