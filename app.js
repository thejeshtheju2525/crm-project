const express = require("express");
const cors = require("cors");

const sequelize = require("./config/database");
const contactRoutes = require("./routes/contactRoutes");
const companyRoutes = require("./routes/companyRoutes");
const leadRoutes = require("./routes/leadRoutes");
const dealRoutes = require("./routes/dealRoutes");

const app = express();

app.use(cors());
app.use(express.json());

let databaseReady;
app.use(async (req, res, next) => {
  if (!databaseReady) {
    databaseReady = sequelize.authenticate().then(() => sequelize.sync());
  }

  try {
    await databaseReady;
    next();
  } catch (error) {
    databaseReady = undefined;
    res.status(500).json({ message: `Database connection failed: ${error.message}` });
  }
});

app.use(["/contacts", "/api/contacts"], contactRoutes);
app.use(["/companies", "/api/companies"], companyRoutes);
app.use(["/leads", "/api/leads"], leadRoutes);
app.use(["/deals", "/api/deals"], dealRoutes);

app.get(["/", "/api"], (req, res) => {
  res.send("CRM API Running...");
});

module.exports = app;
