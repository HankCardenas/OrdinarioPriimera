const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './proveedores.sqlite' // archivo de base de datos
});

module.exports = sequelize;