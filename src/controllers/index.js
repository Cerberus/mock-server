'use strict';

const Model = require('../models/endpoint.model.js');
const chalk = require('chalk');

let getMocks = (req, res) => {
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
};

let getMock = (req, res) => {

  const id = req.params.id;

  Model
  .findById(id)
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
}

let createMock = (req, res) => {

  const payload = req.body;

  if (Object.keys(payload).length === 0) {
    return res.json({
      statusCode: 1001,
      statusMessage: 'Something went wrong'
    });
  } else {

    console.log(chalk.blue(JSON.stringify(payload)));

    let model = new Model({
      name: payload.name,
      url: payload.url,
      method: payload.method,
      response: payload.response
    });

    model.save(err => {
      if (err) {
        return res.json({
          statusCode: 1001,
          statusMessage: err
        });
      }

      return res.json({
        statusCode: 1000,
        statusMessage: 'Create new mock successfully!'
      });
    })
  }
};

let editMock = (req, res) => {

}

let deleteMock = (req, res) => {

}

let defaultGet = (req, res) => {

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

};

let defaultPost = (req, res) => {

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
};

module.exports = {
  getMock: getMock,
  getMocks: getMocks,
  createMock: createMock,
  editMock: editMock,
  deleteMock: deleteMock,
  defaultGet: defaultGet,
  defaultPost: defaultPost
}
