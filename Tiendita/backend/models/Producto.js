const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Producto = sequelize.define('Producto', {
  nombre: DataTypes.STRING,
  precio: DataTypes.FLOAT,
  categoria: DataTypes.STRING,
  imagen: DataTypes.STRING,
  descripcion: DataTypes.STRING
});

module.exports = Producto;
