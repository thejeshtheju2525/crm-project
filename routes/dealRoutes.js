const express = require('express');
const router = express.Router();

const Deal = require('../models/Deal');

router.get('/', async (req, res) => {
  const deals = await Deal.findAll();
  res.json(deals);
});

router.post('/', async (req, res) => {
  const deal = await Deal.create(req.body);
  res.json(deal);
});

router.put('/:id', async (req, res) => {
  await Deal.update(req.body, {
    where: { id: req.params.id }
  });

  res.json({ message: 'Deal updated' });
});

router.delete('/:id', async (req, res) => {
  await Deal.destroy({
    where: { id: req.params.id }
  });

  res.json({ message: 'Deal deleted' });
});

module.exports = router;