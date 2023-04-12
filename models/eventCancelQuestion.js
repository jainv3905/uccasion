const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const EventCancelQuestion = sequelize.define('eventCancelQuestion', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  question: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = EventCancelQuestion;