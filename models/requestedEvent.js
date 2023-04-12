const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const RequestedEvent = sequelize.define('requestedEvent', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  serviceId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  categoryId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  status:{
    type: Sequelize.STRING
  },
  eventId: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = RequestedEvent;