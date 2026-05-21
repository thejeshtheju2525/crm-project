const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Contact = sequelize.define("Contact", {
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

module.exports = Contact;