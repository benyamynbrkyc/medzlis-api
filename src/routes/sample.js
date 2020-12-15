const express = require('express');
const router = express.Router();
const Dzemat = require('../db/models/Dzemat');

router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// middleware that is specific to this router
router.get('/dzemati', (req, res) => {
  Dzemat.find((err, dzemati) => {
    if (err) return console.error(err);
    return res.send(dzemati);
  });
});

module.exports = router;
