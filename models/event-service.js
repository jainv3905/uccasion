const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Event_Service = sequelize.define('event-service', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  service:{
    type: Sequelize.INTEGER
  },
  category:{
    type: Sequelize.INTEGER,
  }
});

module.exports = Event_Service;