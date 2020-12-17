const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dzematiRouter = require('./routes/dzemati');
require('dotenv').config();
const admin = require('firebase-admin');

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://medzlis-maglaj.firebaseio.com',
});

app.use('/dzemati', dzematiRouter);

const PORT = 3000 | process.env.PORT;

app.listen(PORT, console.log('Server is listening on port: ' + PORT));
