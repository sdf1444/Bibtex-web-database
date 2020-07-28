const express = require('express');
const path = require('path');
const logger = require('morgan');
const config = require('./config');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// models
const Database = require('./models/Database');
const Entry = require('./models/Entry');
const User = require('./models/User');
const Group = require('./models/Group');

mongoose
  .connect(
    process.env.MONGODB_URI ||
      'mongodb+srv://sdf1444:boggie234@cluster0-wq3gs.mongodb.net/bibtex?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(function onSuccess() {
    console.log('The server connected with MongoDB.');
  })
  .catch(function onError() {
    console.log('Error while connecting with MongoDB.');
  });

// routes
const auth = require('./routes/auth');
const user = require('./routes/user');
const database = require('./routes/database');
const papers = require('./routes/papers');
const group = require('./routes/group');

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client', 'build', 'index.html'));
  });
}

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
app.use('/public', express.static(path.join(__dirname, 'client/public')));
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json());
app.use(logger('dev'));

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use('/api/user', user);
app.use('/api/auth', auth);
app.use('/api/database', database);
app.use('/api/papers', papers);
app.use('/api/group', group);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname + '/client/build/index.html'));
// });

// error handler middleware
app.use((req, res) => {
  if (!res.data) {
    return res.status(404).send({
      ok: false,
      error: {
        reason: 'Invalid Endpoint',
        code: 404,
      },
    });
  }
  if (res.data.err) {
    return res.status(res.data.status || 400).send({
      ok: false,
      error: {
        reason: res.data.err,
        code: res.data.status || 400,
      },
    });
  }
  return res.status(200).send({
    ok: true,
    response: res.data,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
