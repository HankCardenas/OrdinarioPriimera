const { DataTypes } = require ("sequelize");
const sequelize = require("../conexion");

const boletos = sequelize.define('boletos', {
    id: {
        type : DataTypes.INTEGER,
        primaryKey: true
    },
    localidad: {
        type: DataTypes.TEXT
    },
    fecha: {
        type: DataTypes.TEXT
    },
    precio: {
        type: DataTypes.DOUBLE
    },
    descuento: {
        type: DataTypes.DOUBLE
    }
}, {
    timestamps: false
})

module.exports = boletos;