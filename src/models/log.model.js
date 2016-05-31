'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Log = new Schema({
    methods : String,
    path : String,
    IP: String,
    timestamp: { type : Date , default : Date.now}
});

module.exports = mongoose.model('Log', Log);
