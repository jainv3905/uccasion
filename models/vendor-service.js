const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Vendor_Service = sequelize.define('vendor-service', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  service:{
    type: Sequelize.INTEGER
  }
});

module.exports = Vendor_Service;