const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Banners = sequelize.define('banner', {
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
    type: Sequelize.STRING,
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Banners;