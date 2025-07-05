const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Categoria = sequelize.define('Categoria', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

module.exports = Categoria;
