const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    dzemat: String,
    password: String,
  },
  {
    collection: 'admins',
  }
);

module.exports = mongoose.model('Admins', AdminSchema);
