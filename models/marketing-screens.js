const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Marketing = sequelize.define('marketing', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false
  },
  index: {
    type: Sequelize.INTEGER
  }
});

module.exports = Marketing;