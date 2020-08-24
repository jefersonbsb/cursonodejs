const Sequelize = require('sequelize');

const connection = new Sequelize('guiperguntas','root','Nicolas#1020',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;