const { DataTypes } = require('sequelize');
const sequelize = require('./conexion');

const monedas = sequelize.define('monedas', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement: true 
    },
    origen: { 
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
            notEmpty: true,
            isUppercase: true,
            len: [2, 10]
        }
    },
    destino: { 
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
            notEmpty: true,
            isUppercase: true,
            len: [2, 10]
        }
    },
    valor: { 
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
            isFloat: true,
            min: 0.000001,
            max: 1000000
        }
    },
    ultimaActualizacion: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['origen', 'destino']
        }
    ],
    hooks: {
        beforeUpdate: (moneda) => {
            moneda.ultimaActualizacion = new Date();
        }
    }
});

// Sincronizar el modelo con la base de datos
sequelize.sync({ alter: true })
    .then(() => console.log('Base de datos sincronizada'))
    .catch(error => console.error('Error al sincronizar la base de datos:', error));

module.exports = monedas; 