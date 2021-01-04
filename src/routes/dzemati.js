const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const mongoose = require('mongoose');
const auth = admin.auth();
const db = mongoose.connection;

// models
const Dzemat = require('../models/dzematmodel');
const Admin = require('../models/admin');
const Action = require('../models/action');

// validation
const { validateDzematObject } = require('../validation/validateDzematObject');
const { ActionToHTTPMethod } = require('@google-cloud/storage/build/src/file');

router.get('/', async (req, res) => {
  const dzemati = await Dzemat.find().lean();
  return res.send(dzemati);
});

router.get('/:actionDzematName', async (req, res) => {
  const dzemat = await Dzemat.findOne({
    name: req.params.actionDzematName
  }).lean();
  return res.send(dzemat);
});

router.post('/newDzemat', async (req, res) => {
  const data = validateDzematObject(req.body);
  data.admin.uid = `${data.admin.email}-${data.admin.name}`;
  console.log(data);

  const dzemat = new Dzemat(data.dzemat);
  const admin = new Admin(data.admin);

  try {
    await auth.createUser({
      email: data.admin.email,
      password: data.admin.password,
      displayName: data.admin.name,
      uid: `${data.admin.email}-${data.admin.name}`
    });
  } catch (err) {
    return res.send({ err, message: 'Could not create admin' });
  }

  Promise.all([await dzemat.save(), await admin.save()])
    .then((values) => {
      res.send({
        message: 'Successfully added dzemat and admin',
        values
      });
    })
    .catch((err) => {
      console.error(err);
      return res.send({ error: 'Spremanje dzemata i admina nije uspjelo' });
    });
});

router.delete('/:dzematId/:dzematName/deleteDzemat', async (req, res) => {
  const id = req.params.dzematId;
  const name = req.params.dzematName;

  Promise.all([
    await Dzemat.findByIdAndDelete(id).exec(),
    await Action.deleteMany({ dzemat: name }),
    await Admin.deleteMany({ dzemat: name })
  ])
    .then((result) => {
      return res.send({ message: 'Successfully deleted dzemat' });
    })
    .catch((err) => {
      return res.send({ err, message: 'Could not delete dzemat' });
    });
});

module.exports = router;
