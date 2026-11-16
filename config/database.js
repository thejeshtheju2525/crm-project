const path = require("path");
const { Sequelize } = require("sequelize");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const postgresUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL;

const sequelize = postgresUrl
  ? new Sequelize(postgresUrl, {
      dialect: "postgres",
      logging: false,
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
      },
    })
  : new Sequelize(
      process.env.DB_NAME || "crm",
      process.env.DB_USER || "root",
      process.env.DB_PASSWORD || "",
      {
        host: process.env.DB_HOST || "localhost",
        dialect: "mysql",
        port: Number(process.env.DB_PORT) || 3306,
        logging: false,
      }
    );

module.exports = sequelize;
