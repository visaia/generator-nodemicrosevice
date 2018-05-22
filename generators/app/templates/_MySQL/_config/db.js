'use strict';
var Sequelize = require('Sequelize');
const logUtil = require('../utils/LogUtil');
const config = require('./index');
//innodb_large_prefix
var sequelize = new Sequelize(config.dbName, 'cw_one_card', 'cw_one_card123456', {
  host: 'localhost',
  dialect: 'mysql',
  logging: logUtil.dbInfo,
  timezone:'+08:00',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  // SQLite only
  //storage: 'path/to/database.sqlite'
});

function getStore(){
  return sequelize;
}
module.exports = {
  Sequelize: Sequelize, 
  store:　sequelize,
  getStore:getStore
};
