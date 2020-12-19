const express = require('express');
const router = express.Router();
const Dzemat = require('../models/dzemat');
// const Action = require('../models/action');
const admin = require('firebase-admin');
const mongoose = require('mongoose');

const auth = admin.auth();
const db = mongoose.connection;

// validation
const { validateActionObject } = require('../validation/validateActionObject');

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

router.post('/:actionDzematName/newAction', (req, res) => {
  const actionData = validateActionObject(req.body);
  const id = mongoose.Types.ObjectId();
  actionData._id = id.toHexString();

  Dzemat.findOneAndUpdate(
    { name: req.params.actionDzematName },
    {
      $push: {
        actions: actionData,
      },
    },
    (err, dzemat) => {
      if (err) {
        console.error(err);
        return res.send({ error: 'Spašavanje podataka nije uspjelo' });
      }

      return res.send({
        actionData,
        message: 'Successfully pushed new action',
      });
    }
  );

  db.collection('actions').insertOne(actionData);
});

router.delete('/:actionDzematName/:actionName/deleteAction', (req, res) => {
  const actionToDelete = req.params.actionName;

  Dzemat.findOneAndUpdate(
    { name: req.params.actionDzematName },
    {
      $pull: {
        actions: {
          name: actionToDelete,
        },
      },
    },
    (err, _) => {
      if (err) {
        console.error(err);
        return res.send({ error: 'Brisanje akcije nije uspjelo.' });
      }

      return res.send({
        actionToDelete,
        message: 'Successfully deleted action',
      });
    }
  );
});

module.exports = router;
