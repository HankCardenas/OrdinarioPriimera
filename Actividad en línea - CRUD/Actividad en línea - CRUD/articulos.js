const { DataTypes } = require('sequelize');
const sequelize = require('./conexion');

const articulos = sequelize.define('articulos', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    descripcion: { type: DataTypes.STRING },
    precio: { type: DataTypes.DOUBLE},
    existencia: {type: DataTypes.INTEGER }
}, {
    timestamps: false
});

module.exports = articulos;