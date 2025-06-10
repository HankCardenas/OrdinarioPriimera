const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './clientes.sqlite' // archivo de base de datos
});

module.exports = sequelize;