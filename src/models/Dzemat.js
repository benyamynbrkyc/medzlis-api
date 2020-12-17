const mongoose = require('mongoose');

const DzematSchema = new mongoose.Schema({
  name: String,
  address: String,
  admin: String,
  actions: Array,
});

module.exports = mongoose.model('Dzemat', DzematSchema, 'dzemati');
