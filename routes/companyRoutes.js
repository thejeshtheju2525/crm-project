const express = require("express");

const router = express.Router();

const Company = require("../models/Company");


// GET ALL COMPANIES
router.get("/", async (req, res) => {

  try {

    const companies = await Company.findAll();

    res.json(companies);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// ADD COMPANY
router.post("/", async (req, res) => {

  try {

    const company = await Company.create(req.body);

    res.json(company);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// UPDATE COMPANY
router.put("/:id", async (req, res) => {

  try {

    await Company.update(req.body, {
      where: {
        id: req.params.id
      }
    });

    res.json({
      message: "Company updated"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// DELETE COMPANY
router.delete("/:id", async (req, res) => {

  try {

    await Company.destroy({
      where: {
        id: req.params.id
      }
    });

    res.json({
      message: "Company deleted"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

module.exports = router;