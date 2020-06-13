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
// connectDB();

// Init Middleware
// app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// // Define Routes
app.use('/api/users', require('./server/routes/api/users'));
// app.use('/api/auth', require('./server/routes/api/auth'));
app.use('/api/database', require('./server/routes/api/database'));
// app.use('/api/book', require('./routes/api/book'));
// app.use('/api/booklet', require('./routes/api/booklet'));
// app.use('/api/conference', require('./routes/api/conference'));
// app.use('/api/inBook', require('./routes/api/inBook'));
// app.use('/api/inCollection', require('./routes/api/inCollection'));
// app.use('/api/inProceedings', require('./routes/api/inProceedings'));
// app.use('/api/manual', require('./routes/api/manual'));
// app.use('/api/mastersThesis', require('./routes/api/mastersThesis'));
// app.use('/api/misc', require('./routes/api/misc'));
// app.use('/api/phdThesis', require('./routes/api/phdThesis'));
// app.use('/api/proceedings', require('./routes/api/proceedings'));

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
