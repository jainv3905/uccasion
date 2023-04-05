const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Vendor_Service = sequelize.define('vendor-service', {
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
  }
});

module.exports = Vendor_Service;