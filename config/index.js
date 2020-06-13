require('dotenv').config();

module.exports = {
  DB: process.env.APP_DB,
  PORT: process.env.APP_PORT,
  JWT_SECRET: process.env.APP_SECRET,
};

// const mongoose = require('mongoose');
// const config = require('config');
// const db = config.get('mongoURI');

// const connectDB = async () => {
//   try {
//     await mongoose.connect(db, {
//       useUnifiedTopology: true,
//       useNewUrlParser: true,
//       useCreateIndex: true,
//       useFindAndModify: false,
//     });

//     console.log('MongoDB Connected...');
//   } catch (err) {
//     console.error(err.message);
//     // Exit process with failure
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
