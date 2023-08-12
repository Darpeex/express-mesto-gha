/* eslint-disable import/no-extraneous-dependencies */
// const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/', require('./routes/cards'));
app.use('/', require('./routes/users'));

app.use((req, res, next) => {
  req.user = {
    _id: '64d69b73ce1457bfc056584c', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

// app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log('Ссылка на сервер:');
  console.log(`http://localhost:${PORT}/`);
});
