const express = require('express');
const action = require('../models/action');
const router = express.Router();
const Action = require('../models/action');
const Dzemat = require('../models/dzematmodel');
const mongoose = require('mongoose');

const db = mongoose.connection;

router.get('/:actionDzematName', async (req, res) => {
  const actionsInDzemat = await Action.find({
    dzemat: req.params.actionDzematName,
  }).lean();
  return res.send(actionsInDzemat);
});

router.delete('/:actionDzematName/deleteAction/:actionID', async (req, res) => {
  const actionID = req.params.actionID;
  const dzemat = req.params.actionDzematName;

  Promise.all([
    await Action.findOneAndDelete(actionID),
    await Dzemat.findOneAndUpdate(
      { name: dzemat },
      {
        $pull: {
          actions: {
            _id: actionID,
          },
        },
      }
    ),
  ])
    .then((values) => {
      res.send({
        message: 'Successfully deleted action',
        values,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.send({ error: 'Brisanje akcije nije uspjelo.' });
    });
});

router.delete('/:actionDzematName/deleteAllActions', async (req, res) => {
  const dzematName = req.params.actionDzematName;

  Promise.all([
    await Action.deleteMany({ dzemat: dzematName }),
    await Dzemat.updateOne(
      { name: dzematName },
      {
        $set: {
          actions: [],
        },
      }
    ),
  ])
    .then((result) => {
      return res.send({ action: deletedActions, dzemat: deletedActionsDzemat });
    })
    .catch((err) => {
      return res.send(err);
    });
});

module.exports = router;
