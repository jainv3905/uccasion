const Sequelize = require('sequelize');
const sequelize = new Sequelize("uccasion", "root", "", {
    host: "localhost",
    dialect: "mysql"
  });

module.exports = sequelize;