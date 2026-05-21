const express = require("express");
const router = express.Router();

const Lead = require("../models/Lead");


// GET LEADS
router.get("/", async (req, res) => {

  try {

    const leads = await Lead.findAll();

    res.json(leads);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }
});


// CREATE LEAD
router.post("/", async (req, res) => {

  try {

    const lead = await Lead.create(req.body);

    res.json(lead);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }
});


// UPDATE LEAD
router.put("/:id", async (req, res) => {

  try {

    await Lead.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    const updatedLead = await Lead.findByPk(req.params.id);

    res.json(updatedLead);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }
});


// DELETE LEAD
router.delete("/:id", async (req, res) => {

  try {

    await Lead.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.json({
      message: "Lead deleted",
    });

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }
});

module.exports = router;