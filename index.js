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

app.use("/contacts", contactRoutes);
app.use("/companies", companyRoutes);
app.use("/leads", leadRoutes);
app.use("/deals", dealRoutes);

app.get("/", (req, res) => {
  res.send("CRM API Running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  try {
    await sequelize.authenticate();
    console.log("Database connected");

    await sequelize.sync({ alter: true });
    console.log("Database synced");
  } catch (err) {
    console.log("Database connection error:", err.message);
  }
});