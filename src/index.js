const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const CONNECTION_STRING =
  'mongodb+srv://benjaminbrkic:benjaminbrkic@medzlis-cluster.ek03h.mongodb.net/medzlis-db?retryWrites=true&w=majority';
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

const sampleRouter = require('./routes/sample');

const app = express();
app.use('/sample', sampleRouter);
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

const PORT = 3000 | process.env.PORT;

app.get('/', (req, res) => {
  res.send({ message: 'Hello' });
});

app.listen(PORT, console.log('Server listening on port: ' + PORT));
