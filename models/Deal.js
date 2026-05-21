const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Deal = sequelize.define('Deal', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  company: {
    type: DataTypes.STRING,
    allowNull: false
  },

  value: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  stage: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Deal;