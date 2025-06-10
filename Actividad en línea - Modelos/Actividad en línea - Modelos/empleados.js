const { DataTypes } = require('sequelize');
const sequelize = require('./conexion');

const empleados = sequelize.define('empleados', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    nombre: { type: DataTypes.STRING },
    telefono: { type: DataTypes.STRING },
    nacimiento: { type: DataTypes.STRING},
    sueldo: { type: DataTypes.DOUBLE}
}, {
    timestamps: false
});

module.exports = empleados;