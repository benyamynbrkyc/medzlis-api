const express = require('express');
const action = require('../models/action');
const router = express.Router();
const Action = require('../models/action');
const Dzemat = require('../models/dzemat');
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

  const action = await Action.findOneAndDelete(actionID);
  if (!action) return res.status(404).send({ error: 'error' });
  // TODO: INTEGRATE! IT WORKS
  return res.send({ action, message: 'Success' });

  // Promise.all([
  //   await db.collection('actions').deleteOne({ _id: actionID }),
  //   await Dzemat.findOneAndUpdate(
  //     { name: dzemat },
  //     {
  //       $pull: {
  //         actions: {
  //           _id: actionID,
  //         },
  //       },
  //     }
  //   ),
  // ])
  //   .then((values) => {
  //     res.send({
  //       message: 'Successfully deleted action',
  //       values,
  //     });
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     return res.send({ error: 'Brisanje akcije nije uspjelo.' });
  //   });
});

module.exports = router;
