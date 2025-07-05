const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Usuario = sequelize.define('Usuario', {
  nombre: DataTypes.STRING,
  apellido: DataTypes.STRING,
  correo: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
  rol: DataTypes.STRING
});

module.exports = Usuario;
