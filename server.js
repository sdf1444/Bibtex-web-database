const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
