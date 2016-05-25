'use strict';

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const db = require('./db')() // invoke db.

const { APP_PORT } = require('./config');

app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');

  next();

});
app.use(morgan('dev'));

require('./routes')(app);

app.listen(APP_PORT, function () {
  console.log(`App listening on port ${APP_PORT}!`);
});
