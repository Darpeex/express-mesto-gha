// класс ошибки собственника карты
class OwnerCardError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = OwnerCardError;
