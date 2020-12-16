const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const sampleRouter = require('./routes/sample');
require('dotenv').config();

const CONNECTION_STRING = process.env.MONGODB_ATLAS_CONNECTION_STRING;
mongoose.connect(CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Successfully connected to Atlas');
});

const app = express();
app.use(cors());

app.use('/sample', sampleRouter);

const PORT = 3000 | process.env.PORT;

app.listen(PORT, console.log('Server listening on port: ' + PORT));
