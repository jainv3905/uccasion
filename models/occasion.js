const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Occasion = sequelize.define('occasion', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  occasion: {
    type: Sequelize.STRING,
    allowNull: false
  },
  logo: {
    type: Sequelize.STRING,
  }
});

module.exports = Occasion;