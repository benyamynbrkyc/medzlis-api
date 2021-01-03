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

router.post('/new/admin/:dzematName', async (req, res) => {
  const adminObj = req.body;
  const response = {};
  try {
    admin
      .auth()
      .createUser({
        email: adminObj.email,
        password: adminObj.password,
        displayName: adminObj.name
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

        console.log(response);
        return res.send(response);
      })
      .catch((err) => {
        return res.send({ message: 'Error creating new user:', err });
      });
  } catch (err) {
    return res.send({ err, message: 'Could not create admin' });
  }
});

module.exports = router;
