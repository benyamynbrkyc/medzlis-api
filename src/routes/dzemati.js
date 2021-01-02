const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const mongoose = require('mongoose');
const auth = admin.auth();
const db = mongoose.connection;

// models
const Dzemat = require('../models/dzematmodel');
const Admin = require('../models/admin');

// validation
const { validateDzematObject } = require('../validation/validateDzematObject');

router.get('/', async (req, res) => {
  const dzemati = await Dzemat.find().lean();
  return res.send(dzemati);
});

router.get('/:actionDzematName', async (req, res) => {
  const dzemat = await Dzemat.findOne({
    name: req.params.actionDzematName,
  }).lean();
  return res.send(dzemat);
});

router.post('/newDzemat', async (req, res) => {
  const data = validateDzematObject(req.body);

  const dzemat = new Dzemat(data.dzemat);
  const admin = new Admin(data.admin);

  Promise.all([await dzemat.save(), await admin.save()])
    .then((values) => {
      res.send({
        message: 'Successfully added dzemat and admin',
        values,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.send({ error: 'Spremanje dzemata i admina nije uspjelo' });
    });
});

module.exports = router;
