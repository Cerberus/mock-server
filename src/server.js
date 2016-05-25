'use strict';

const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const db = require('./db')() // invoke db.

const { APP_PORT } = require('./config');
const Model = require('./models/endpoint.model.js');

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

app.get('/mocks', (req, res) => {

  Model
  .find({})
  .exec((err, result) => {
    if (err) {
      return res.json({
        statusCode: 1001,
        statusMessage: err
      });
    }

    return res.json({
      statusCode: 1000,
      statusMessage: 'OK',
      data: result
    });
  });
});

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
