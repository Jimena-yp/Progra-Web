const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Orden = sequelize.define('Orden', {
  usuarioId: DataTypes.INTEGER,
  total: DataTypes.FLOAT,
  estado: DataTypes.STRING,
  fecha: DataTypes.DATE 
});

module.exports = Orden;
