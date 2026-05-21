const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  'crm_db',
  'root',
  'Mohana@2525',
  {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
  }
);

module.exports = sequelize ;