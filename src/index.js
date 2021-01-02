const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const admin = require('firebase-admin');
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://medzlis-maglaj.firebaseio.com',
  storageBucket: 'medzlis-maglaj.appspot.com',
});

// routes
const dzematiRouter = require('./routes/dzemati');
const actionsRouter = require('./routes/actions');

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
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('/dzemati', dzematiRouter);
app.use('/actions', actionsRouter);

const PORT = 3000 | process.env.PORT;

app.listen(PORT, console.log('Server is listening on port: ' + PORT));
