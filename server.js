const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

mongoose
  .connect(
    process.env.MONGODB_URI ||
      'mongodb://sdf1444:boggie234@cluster0-wq3gs.mongodb.net/bibtex?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  )
  .then(function onSuccess() {
    console.log('The server connected with MongoDB.');
  })
  .catch(function onError() {
    console.log('Error while connecting with MongoDB.');
  });

// Define Routes
app.use('/api/user', require('./routes/user'));
app.use('/api/auth', require('./routes//auth'));
app.use('/api/database', require('./routes/database'));
app.use('/api/papers', require('./routes/papers'));
app.use('/api/group', require('./routes/group'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// error handler middleware
app.use((req, res) => {
  if (!res.data) {
    return res.status(404).send({
      ok: false,
      error: {
        reason: 'Invalid Endpoint',
        code: 404
      }
    });
  }
  if (res.data.err) {
    return res.status(res.data.status || 400).send({
      ok: false,
      error: {
        reason: res.data.err,
        code: res.data.status || 400
      }
    });
  }
  return res.status(200).send({
    ok: true,
    response: res.data
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
