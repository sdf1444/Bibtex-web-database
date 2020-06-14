require('dotenv').config();

module.exports = {
  DB: process.env.APP_DB,
  PORT: process.env.APP_PORT,
  JWT_SECRET: process.env.APP_SECRET,
};
