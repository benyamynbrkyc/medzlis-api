const express = require('express');
const router = express.Router();
const Dzemat = require('../models/dzemat');
const admin = require('firebase-admin');

// validation
const { validateActionObject } = require('../validation/validateActionObject');

router.get('/', (req, res) => {
  Dzemat.find((err, dzemati) => {
    if (err) return console.error(err);
    return res.send({ dzemati, message: 'You got your message' });
  });
});

router.get('/:actionDzematName', (req, res) => {
  Dzemat.find({ name: req.params.actionDzematName }, (err, dzemat) => {
    if (err) {
      console.error(err);
      return res.send({ error: 'Taj dzemat ne postoji' });
    }
    return res.send({
      dzemat,
      message: 'Successfully fetched dzemat',
    });
  });
});

router.post('/:actionDzematName/newAction', (req, res) => {
  const actionData = validateActionObject(req.body);
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
        return res.send({ error: 'Spasavanje podataka nije uspjelo' });
      }

      return res.send({
        actionData,
        message: 'Successfully pushed new action',
      });
    }
  );
});

router.delete('/:actionDzematName/:actionName/deleteAction', (req, res) => {
  const actionData = req.body;
  console.log(actionData);
  // Dzemat.findOneAndUpdate(
  //   { name: req.params.actionDzematName },
  //   {
  //     $pull: {
  //       actions: {
  //         name: actionData.name,
  //       },
  //     },
  //   },
  //   (err, dzemat) => {
  //     if (err) {
  //       console.error(err);
  //       return res.send({ error: 'Spasavanje podataka nije uspjelo' });
  //     }

  //     return res.send({
  //       actionData,
  //       message: 'Successfully pushed new action',
  //     });
  //   }
  // );
});

// router.post('/writeUser', (req, res) => {
//   admin
//     .auth()
//     .createUser({
//       email: 'benjamin.brkic@gmail.com',
//       emailVerified: true,
//       password: '123456',
//       displayName: 'Benjamin Brkic',
//       uid: 'Benjamin Brkic',
//     })
//     .then((userRecord) => {
//       return res.send({ 'Successfully created new user: ': userRecord });
//     })
//     .catch((e) => {
//       return res.send({ error: e });
//     });
// });

module.exports = router;
