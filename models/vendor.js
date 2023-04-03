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
  outlet_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  outlet_address: {
    type: Sequelize.STRING,
    allowNull: false
  },
  outlet_contact: {
    type: Sequelize.BIGINT,
    allowNull: false
  },
  outlet_description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  outlet_image: {
    type: Sequelize.STRING
  },
  status: {
    type: Sequelize.STRING
  }
});

module.exports = Vendor;