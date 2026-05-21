const { DataTypes } = require("sequelize");

const sequelize = require("../config/database");

const Company = sequelize.define("Company", {

  name: {
    type: DataTypes.STRING,
  },

  email: {
    type: DataTypes.STRING,
  },

  phone: {
    type: DataTypes.STRING,
  },

});

module.exports = Company;