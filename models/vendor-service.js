const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Vendor_Service = sequelize.define('vendorservice', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  serviceId:{
    type: Sequelize.INTEGER
  },
  occasionId: {
    type: Sequelize.INTEGER
  },
  status: {
    type: Sequelize.STRING
  }
});

module.exports = Vendor_Service;