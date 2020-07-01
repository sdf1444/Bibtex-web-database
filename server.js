const express = require('express');
const path = require('path');
const logger = require('morgan');
const config = require('./config');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

mongoose
  .connect(config.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(function onSuccess() {
    console.log('The server connected with MongoDB.');
  })
  .catch(function onError() {
    console.log('Error while connecting with MongoDB.');
  });

/** Seting up server to accept cross-origin browser requests */
app.use(function (req, res, next) {
  //allow cross origin requests
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, PUT, OPTIONS, DELETE, GET'
  );
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json());
app.use(logger('dev'));

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use('/api/user', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/database', require('./routes/api/database'));
app.use('/api/papers', require('./routes/api/papers'));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
