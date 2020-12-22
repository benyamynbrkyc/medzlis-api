const mongoose = require('mongoose');

const DzematSchema = new mongoose.Schema(
  {
    name: String,
    admin: String,
    actions: Array,
    displayName: String,
  },
  {
    collection: 'dzemati',
  }
);

module.exports = mongoose.model('Dzemat', DzematSchema);
