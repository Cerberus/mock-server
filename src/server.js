'use strict';

const express = require('express');
const app = express();

const { APP_PORT } = require('./config');

const db = require('./db')() // invoke db.

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(APP_PORT, function () {
  console.log(`App listening on port ${APP_PORT}!`);
});
