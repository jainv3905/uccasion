const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  first_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  last_name:{
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  phone: {
    type: Sequelize.BIGINT
  },
  countryCode: {
    type: Sequelize.INTEGER,
  },
  token:{
    type: Sequelize.STRING
  },
  otp:{
    type: Sequelize.INTEGER
  },
  status:{
    type: Sequelize.STRING
  }
});

module.exports = User;