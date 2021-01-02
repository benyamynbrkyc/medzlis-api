const express = require('express');
const action = require('../models/action');
const router = express.Router();
const Action = require('../models/action');
const Dzemat = require('../models/dzematmodel');
const mongoose = require('mongoose');
const { bucket, defaultBucketName } = require('../firebase/bucket');

const db = mongoose.connection;

// validation
const { validateActionObject } = require('../validation/validateActionObject');

router.get('/:actionDzematName', async (req, res) => {
  const actionsInDzemat = await Action.find({
    dzemat: req.params.actionDzematName
  }).lean();
  return res.send(actionsInDzemat);
});

router.delete('/:actionDzematName/deleteAction/:actionID', async (req, res) => {
  const actionID = req.params.actionID;
  const dzemat = req.params.actionDzematName;

  Promise.all([
    await db.collection('actions').deleteOne({ _id: actionID }),
    await Dzemat.findOneAndUpdate(
      { name: dzemat },
      {
        $pull: {
          actions: {
            _id: actionID
          }
        }
      }
    )
  ])
    .then((values) => {
      res.send({
        message: 'Successfully deleted action',
        values
      });
    })
    .catch((err) => {
      return res.send({ err, message: 'Brisanje akcije nije uspjelo.' });
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
          actions: []
        }
      }
    )
  ])
    .then((result) => {
      return res.send({ action: deletedActions, dzemat: deletedActionsDzemat });
    })
    .catch((err) => {
      return res.send(err);
    });
});

router.post('/:actionDzematName/newAction', async (req, res) => {
  const actionData = validateActionObject(req.body);

  const firebaseImgDataURI = actionData.dataURI;
  let imgURL;

  try {
    const base64Text = firebaseImgDataURI.split(';base64,').pop();
    const imageBuffer = Buffer.from(base64Text, 'base64');

    const fileName = `action~~${actionData.dzemat}~~${actionData.name}`;
    const imageURL =
      'https://firebasestorage.googleapis.com/v0/b/medzlis-maglaj.appspot.com/' +
      fileName;

    const file = bucket.file(fileName);

    await file.save(imageBuffer, {
      public: true,
      gzip: true,
      predefinedAcl: 'publicRead',
      metadata: {
        cacheControl: 'public, max-age=31536000'
      }
    });
    const metadata = await file.getMetadata();

    imgURL = metadata[0].mediaLink;
  } catch (error) {
    return res.send(error);
  }

  actionData.imgURL = imgURL;
  delete actionData.dataURI;

  const id = mongoose.Types.ObjectId();
  actionData._id = id.toHexString();

  Promise.all([
    Dzemat.findOneAndUpdate(
      { name: req.params.actionDzematName },
      {
        $push: {
          actions: actionData
        }
      }
    ),
    await db.collection('actions').insertOne(actionData)
  ])
    .then((data) => {
      return res.send({ data, actionData });
    })
    .catch((err) => {
      res.send(err);
    });
});

router.patch('/:dzemat/:actionID', async (req, res) => {
  const actionData = validateActionObject(req.body);

  const firebaseImgDataURI = actionData.dataURI;

  if (firebaseImgDataURI !== 'not changed') {
    try {
      let imgURL;

      const base64Text = firebaseImgDataURI.split(';base64,').pop();
      const imageBuffer = Buffer.from(base64Text, 'base64');

      const fileName = `action~~${actionData.dzemat}~~${actionData.name}`;
      const imageURL =
        'https://firebasestorage.googleapis.com/v0/b/medzlis-maglaj.appspot.com/' +
        fileName;

      const file = bucket.file(fileName);

      await file.save(imageBuffer, {
        public: true,
        gzip: true,
        predefinedAcl: 'publicRead',
        metadata: {
          cacheControl: 'public, max-age=31536000'
        }
      });
      const metadata = await file.getMetadata();

      imgURL = metadata[0].mediaLink;

      actionData.imgURL = imgURL;
    } catch (err) {
      return res.send({ err, message: 'Error saving to firebase storage' });
    }
  }

  delete actionData.dataURI;

  try {
    await Dzemat.updateOne(
      { 'actions._id': actionData._id },
      {
        $set: {
          'actions.$.imgURL': actionData.imgURL,
          'actions.$.price': actionData.price,
          'actions.$.desc': actionData.desc,
          'actions.$.name': actionData.name,
          'actions.$.displayName': actionData.displayName,
          'actions.$.dzemat': actionData.dzemat
        }
      },
      {
        new: true
      }
    );

    await db.collection('actions').findOneAndUpdate(
      { _id: actionData._id },
      {
        $set: {
          imgURL: actionData.imgURL,
          price: actionData.price,
          desc: actionData.desc,
          name: actionData.name,
          displayName: actionData.displayName,
          dzemat: actionData.dzemat
        }
      }
    );

    return res.send({ message: 'Successfully saved to db', actionData });
  } catch (err) {
    return res.send({ err, message: 'Error saving to db' });
  }
});

module.exports = router;
