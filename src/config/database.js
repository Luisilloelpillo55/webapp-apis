const path = require('path');
const { Sequelize } = require('sequelize');

const storage = process.env.NODE_ENV === 'test' 
  ? path.join(__dirname, '../../data/database-test.sqlite')
  : path.join(__dirname, '../../data/database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage,
  logging: false
});

module.exports = sequelize;
