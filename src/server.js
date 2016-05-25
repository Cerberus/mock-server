'use strict';

const express = require('express');
const app = express();

const db = require('./db')() // invoke db.

const { APP_PORT } = require('./config');
const Model = require('./models/endpoint.model.js');

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('*', (req, res) => {

  const path = req.path;

  Model
  .findOne({url: path, method: 'GET'})
  .exec((err, result) => {
    if (err) return err;

    const response = JSON.parse(result.response);
    return res.json(response);
  });

});

app.post('*', (req, res) => {

  const path = req.path;

  Model
  .findOne({url: path, method: 'POST'})
  .exec((err, result) => {
    if (err) return err;

    const response = JSON.parse(result.response);
    return res.json(response);
  });
});

app.listen(APP_PORT, function () {
  console.log(`App listening on port ${APP_PORT}!`);
});
