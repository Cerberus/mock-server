'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Group = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  }
});

module.exports = mongoose.model('Group', Group);
