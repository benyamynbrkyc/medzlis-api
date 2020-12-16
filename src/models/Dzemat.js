const mongoose = require('mongoose');

const DzematSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    admin: String,
  },
  { collection: 'completed' }
);

module.exports = mongoose.model('Dzemat', DzematSchema, 'dzemati');
