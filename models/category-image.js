const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Category_Image = sequelize.define('category-image', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Category_Image;