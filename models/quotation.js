const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Quotation = sequelize.define('quotation', {
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
  price:{
    type: Sequelize.INTEGER,
    allowNull: false
  },
  event: {
    type: Sequelize.STRING,
    allowNull: false
  },
  vendor:{
    type: Sequelize.STRING,
    allowNull: false
  },
  user:{
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Quotation;