'use strict';

require('dotenv').config();

module.exports = {
  APP_PORT: 8081,
  DATABASE_NAME: process.env.DATABASE || 'mongodb://localhost:27017/nextzy_json_mock'
}
