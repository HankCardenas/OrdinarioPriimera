const {Sequelize} = require('sequelize')

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage:'./sueldos.sqlite'
})

module.exports=sequelize;