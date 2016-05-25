'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let EndpointSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: { unique: true }
  },
  method: {
    type: String,
    requried: true
  }
  url: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: { unique: true }
  },
  response: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Endpoint', EndpointSchema);
