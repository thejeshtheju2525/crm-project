const express = require("express");

const router = express.Router();

const Lead = require("../models/Lead");


// GET ALL LEADS
router.get("/", async (req, res) => {

  try {

    const leads = await Lead.findAll();

    res.json(leads);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// ADD LEAD
router.post("/", async (req, res) => {

  try {

    const lead = await Lead.create(req.body);

    res.json(lead);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// UPDATE LEAD
router.put("/:id", async (req, res) => {

  try {

    await Lead.update(req.body, {
      where: {
        id: req.params.id
      }
    });

    res.json({
      message: "Lead updated"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// DELETE LEAD
router.delete("/:id", async (req, res) => {

  try {

    await Lead.destroy({
      where: {
        id: req.params.id
      }
    });

    res.json({
      message: "Lead deleted"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

module.exports = router;