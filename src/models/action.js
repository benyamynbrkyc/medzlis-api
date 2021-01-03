const mongoose = require('mongoose');

const ActionSchema = new mongoose.Schema(
  {
    name: String,
    displayName: String,
    dzemat: String,
    price: Number,
    desc: String,
    imgURL: String,
    donators: Array,
    totalDonated: Number,
    closed: Boolean
  },
  {
    collection: 'actions'
  }
);

module.exports = mongoose.model('Action', ActionSchema);
