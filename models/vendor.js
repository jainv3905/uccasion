const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Vendor = sequelize.define('vendor', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  },
  phone: {
    type: Sequelize.BIGINT,
    allowNull: false
  },
  status: {
    type: Sequelize.STRING
  }
});

module.exports = Vendor;