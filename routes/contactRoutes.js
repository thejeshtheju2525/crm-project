const express = require("express");
const router = express.Router();

const Contact = require("../models/Contact");


// GET ALL CONTACTS
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// CREATE CONTACT
router.post("/", async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// UPDATE CONTACT
router.put("/:id", async (req, res) => {
  try {

    await Contact.update(req.body, {
      where: { id: req.params.id },
    });

    const updatedContact = await Contact.findByPk(req.params.id);

    res.json(updatedContact);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// DELETE CONTACT
router.delete("/:id", async (req, res) => {
  try {

    await Contact.destroy({
      where: { id: req.params.id },
    });

    res.json({ message: "Contact deleted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;