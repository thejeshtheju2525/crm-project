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

sequelize
  .sync()
  .then(() => {
    console.log("Database connected");

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });