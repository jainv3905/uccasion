const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const InvitationList = sequelize.define('invitationList', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  invitationCardId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  address:{
    type: Sequelize.STRING,
    allowNull: false
  },
  date:{
    type: Sequelize.STRING,
    allowNull: false
  },
  time:{
    type: Sequelize.STRING,
    allowNull: false
  },
  eventDescription:{
    type: Sequelize.STRING,
    allowNull: false
  },
  eventHosted:{
    type: Sequelize.STRING,
    allowNull: false
  },
  guestId: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = InvitationList;