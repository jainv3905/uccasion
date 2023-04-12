const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Service = sequelize.define('service', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  service: {
    type: Sequelize.STRING,
    allowNull: false
  },
  logo: {
    type: Sequelize.STRING,
    allowNull: false
  },
  image: {
    type: Sequelize.STRING,
    // allowNull: false
  },
  status:{
    type: Sequelize.STRING
  }
});

module.exports = Service;