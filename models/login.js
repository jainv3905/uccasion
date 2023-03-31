const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Login = sequelize.define('login', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  token:{
    type: Sequelize.STRING
  }
});

module.exports = Login;