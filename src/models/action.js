const mongoose = require('mongoose');

const ActionSchema = new mongoose.Schema(
  {
    name: String,
    dzemat: String,
    price: Number,
    desc: String,
    imgURL: String,
  },
  {
    collection: 'actions',
  }
);

module.exports = mongoose.model('Action', ActionSchema);
