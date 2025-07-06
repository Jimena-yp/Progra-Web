const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('tiendita', 'tiendita_user', '12345678', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;