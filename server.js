const cors = require('cors');
const express = require('express');
const bp = require('body-parser');
const passport = require('passport');
const { connect } = require('mongoose');
const { success, error } = require('consola');

// Bring in the app constants
const { DB, PORT } = require('./config');

// Initialize the application
const app = express();

// Middlewares
app.use(cors());
app.use(bp.json());
app.use(passport.initialize());

require('./middleware/passport')(passport);

// User Router Middleware
app.use('/api/users', require('./server/routes/api/users'));
app.use('/api/database', require('./server/routes/api/database'));

const startApp = async () => {
  try {
    // Connection With DB
    await connect(DB, {
      useFindAndModify: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    success({
      message: `MongoDB Connected \n${DB}`,
      badge: true,
    });

    // Start Listenting for the server on PORT
    app.listen(PORT, () =>
      success({ message: `Server started on PORT ${PORT}`, badge: true })
    );
  } catch (err) {
    error({
      message: `MongoDB Connection Unsuccessful \n${err}`,
      badge: true,
    });
    startApp();
  }
};

startApp();
