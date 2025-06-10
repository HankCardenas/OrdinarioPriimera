const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './articulos.sqlite' // archivo de base de datos
});

module.exports = sequelize;