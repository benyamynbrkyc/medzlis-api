const express = require('express');
const router = express.Router();
const Dzemat = require('../db/models/Dzemat');

// middleware that is specific to this router
router.get('/dzemati', (req, res) => {
  Dzemat.find((err, dzemati) => {
    if (err) return console.error(err);
    return res.send(dzemati);
  });
});

module.exports = router;
