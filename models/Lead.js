const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Lead = sequelize.define("Lead", {

  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  status: {
    type: DataTypes.STRING,
    defaultValue: "New",
  },

  source: {
    type: DataTypes.STRING,
    defaultValue: "Website",
  },

});

module.exports = Lead;