const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' })); // или err.message
};

module.exports.createCard = (req, res) => {
  console.log(req.user._id); // _id доступен

  const { name, link } = req.body;
  Card.create({ name, link })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(400).send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  const { id } = req.body;

  Card.deleteOne({ _id: id })
    .then(() => res.send({ message: 'Карточка успешно удалена' }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
