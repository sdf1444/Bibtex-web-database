const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/database', require('./routes/api/database'));
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
