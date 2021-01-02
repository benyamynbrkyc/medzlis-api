// const { Storage } = require('@google-cloud/storage');
const admin = require('firebase-admin');

const bucket = admin.storage().bucket();

const defaultBucketName = bucket.name;

// const storage = new Storage();

// const defaultBucketName = storage.bucket.name;

module.exports = {
  bucket,
  defaultBucketName,
};
