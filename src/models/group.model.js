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
  },
  list: [{	
		type: Schema.ObjectId,
		ref: 'Endpoint',
		default: []
  }]
});

module.exports = mongoose.model('Group', Group);
