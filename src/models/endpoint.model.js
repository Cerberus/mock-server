'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let EndpointSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  method: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true,
    lowercase: true
  },
  type: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Endpoint', EndpointSchema);
