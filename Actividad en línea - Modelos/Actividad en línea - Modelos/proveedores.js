const { DataTypes } = require('sequelize');
const sequelize = require('./conexion');

const proveedores = sequelize.define('proveedores', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    nombre: { type: DataTypes.STRING },
    direccion: { type: DataTypes.STRING}
}, {
    timestamps: false
});

module.exports = proveedores;