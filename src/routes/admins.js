const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');
const Dzemat = require('../models/dzematmodel');
const admin = require('firebase-admin');

router.get('/:dzematName', async (req, res) => {
  try {
    const admin = await Admin.findOne({
      dzemat: req.params.dzematName
    }).lean();
    return res.send({ admin });
  } catch (err) {
    return res.send({ err, message: 'Could not get Admin object' });
  }
});

router.get('/adminByEmail/:email', async (req, res) => {
  try {
    const admin = await Admin.findOne({
      email: req.params.email
    }).lean();
    return res.send({ admin });
  } catch (err) {
    return res.send({ err, message: 'Could not get Admin object' });
  }
});

router.post('/new/admin/:dzematName', async (req, res) => {
  const adminObj = req.body;
  const response = {};
  // try {
  try {
    const user = await admin.auth().getUser(`${adminObj.email}`);

    if (user.email) {
      response.mongoAdmin = await Admin.findOneAndUpdate(
        { dzemat: req.params.dzematName },
        {
          name: adminObj.displayName,
          password: adminObj.password,
          email: adminObj.email
        }
      ).exec();

      response.dzemat = await Dzemat.findOneAndUpdate(
        { name: req.params.dzematName },
        {
          admin: adminObj.displayName
        }
      );

      return res.send(response);
    }
  } catch (err) {
    admin
      .auth()
      .createUser({
        email: adminObj.email,
        password: adminObj.password,
        displayName: adminObj.displayName,
        uid: `${adminObj.email}`
      })
      .then(async (userRecord) => {
        response.newAdmin = {
          message: 'Successfully created new user:',
          userRecord
        };

        response.mongoAdmin = await Admin.findOneAndUpdate(
          { dzemat: req.params.dzematName },
          {
            name: adminObj.displayName,
            password: adminObj.password,
            email: adminObj.email
          }
        ).exec();

        response.dzemat = await Dzemat.findOneAndUpdate(
          { name: req.params.dzematName },
          {
            admin: adminObj.displayName
          }
        );

        return res.send(response);
      })
      .catch((err) => {
        if (
          err.code == 'auth/email-already-exists' ||
          err.code == 'auth/uid-already-exists'
        ) {
          admin
            .auth()
            .deleteUser(`${adminObj.email}`)
            .then(() => {
              admin
                .auth()
                .createUser({
                  uid: `${adminObj.email}`,
                  email: adminObj.email,
                  password: adminObj.password,
                  displayName: adminObj.displayName
                })
                .then((result) => {
                  return res.send({
                    message: 'Successfully created user',
                    result
                  });
                })
                .catch((err) => {
                  return res.send({
                    message: 'THIS: Error creating new user:',
                    err
                  });
                });
            })
            .catch((err) => {
              return res.send({
                message: 'THIS: Error creating new user:',
                err
              });
            });
        }
      });
  }

  return;

  // } catch (err) {
  //   return res.send({ err, message: 'Could not create admin' });
  // }
});

module.exports = router;
