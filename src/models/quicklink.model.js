'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Group = new Schema({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Link', Group);
