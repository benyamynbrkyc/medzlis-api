const express = require('express');
const router = express.Router();
const Action = require('../models/action');

router.get('/:actionDzematName', async (req, res) => {
  const actionsInDzemat = await Action.find({
    dzemat: req.params.actionDzematName,
  }).lean();
  return res.send(actionsInDzemat);
});

module.exports = router;
