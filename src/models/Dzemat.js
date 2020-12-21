const mongoose = require('mongoose');

const DzematSchema = new mongoose.Schema(
  {
    name: String,
    admin: String,
    actions: Array,
  },
  {
    collection: 'dzemati',
  }
);

module.exports = mongoose.model('Dzemat', DzematSchema);
