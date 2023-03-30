const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Event = sequelize.define('event', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  date: {
    type: Sequelize.STRING,
  },
  event: {
    type: Sequelize.INTEGER
  },
  guestCount: {
    type: Sequelize.INTEGER
  },
  budget:{
    type: Sequelize.INTEGER
  }
});

module.exports = Event;