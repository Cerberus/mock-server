'use strict';

const mongoose = require('mongoose');
const chalk = require('chalk');
const { DATABASE_NAME } = require('./config');

module.exports = function() {
  let db = mongoose.connect(DATABASE_NAME, function(err) {
    if (err) {
      console.log(chalk.red(err));
    } else {
      console.log(chalk.blue('Connected mongodb with ' + DATABASE_NAME));
    }
  });

  mongoose.connection.on('error', function(err) {
    console.error(chalk.red('MongoDB connection error: ' + err));
    process.exit(-1);
  });

  return db;
};
