const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
    'node-complete',
    'root',
    'Fbi121212@alaa.zameel',
    { dialect: 'mysql', host: 'localhost' }
);

module.exports = sequelize;