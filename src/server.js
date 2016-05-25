'use strict';

const express = require('express');
const app = express();

const db = require('./db')() // invoke db.

const { APP_PORT } = require('./config');
const Model = require('./models/endpoint.model.js');

app.get('/', (req, res) => {
  res.send('Hello World!');
});


// TODO: match with regex
//app.get('/service/mobile/:mobileNo')
// match /service/mobile/12345
// match /service/mobile/55555
// match /service/mobile/:mobileNo

app.get('*', (req, res) => {

  const path = req.path;

  let matched = path.match(/:\w+/g);

  Model
  .findOne({url: path, method: 'GET'})
  .exec((err, result) => {
    if (err) return err;

    if (result) {
      const response = JSON.parse(result.response);
      return res.json(response);
    } else {
      return res.json({});
    }

  });

});

app.post('*', (req, res) => {

  const path = req.path;

  Model
  .findOne({url: path, method: 'POST'})
  .exec((err, result) => {
    if (err) return err;

    if (result) {
      const response = JSON.parse(result.response);
      return res.json(response);
    } else {
      return res.json({});
    }
  });
});

app.listen(APP_PORT, function () {
  console.log(`App listening on port ${APP_PORT}!`);
});
