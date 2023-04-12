const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Invitation = sequelize.define('invitation', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false
  },
  backgroundColor:{
    type: Sequelize.STRING
  },
  event:{
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Invitation;