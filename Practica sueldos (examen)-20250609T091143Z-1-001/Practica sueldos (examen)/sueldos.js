const { DataTypes } = require('sequelize');
const sequelize = require('../conexion')

const sueldos = sequelize.define('sueldos',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    tipo:{
        type: DataTypes.STRING
    },
    sueldoDiario:{
        type: DataTypes.DOUBLE   
    },
    bono:{
        type: DataTypes.DOUBLE
    }
},{
    timestamps: false
})

module.exports = sueldos;