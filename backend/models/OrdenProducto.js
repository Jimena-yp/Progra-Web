const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Orden = require('./Orden');
const Producto = require('./Producto');

const OrdenProducto = sequelize.define('OrdenProducto', {
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'OrdenProductos'
});

Orden.belongsToMany(Producto, { through: OrdenProducto, foreignKey: 'ordenId', otherKey: 'productoId' });
Producto.belongsToMany(Orden, { through: OrdenProducto, foreignKey: 'productoId', otherKey: 'ordenId' });

OrdenProducto.belongsTo(Orden, { foreignKey: 'ordenId' });
OrdenProducto.belongsTo(Producto, { foreignKey: 'productoId' });

module.exports = OrdenProducto;
module.exports = OrdenProducto;
module.exports = OrdenProducto;
