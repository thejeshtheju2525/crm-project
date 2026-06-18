const { Sequelize } = require("sequelize");

let sequelize;

if (process.env.DATABASE_URL || process.env.MYSQL_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL || process.env.MYSQL_URL, {
    dialect: "mysql",
    logging: false,
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || process.env.MYSQLDATABASE || "crm_db",
    process.env.DB_USER || process.env.MYSQLUSER || "root",
    process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || "Mohana@2525",
    {
      host: process.env.DB_HOST || process.env.MYSQLHOST || "localhost",
      port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
      dialect: process.env.DB_DIALECT || "mysql",
      logging: false,
    }
  );
}

module.exports = sequelize;