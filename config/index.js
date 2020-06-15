require('dotenv').config();

module.exports = {
  DB: process.env.APP_DB,
  PORT: process.env.APP_PORT,
  JWT_SECRET: process.env.APP_SECRET,
  RESET_PASSWORD: process.env.APP_RESET_PASSWORD,
  MAILGUN_API: process.env.APP_MAILGUN_API,
  CLIENT_URL: process.env.APP_CLIENT_URL,
};
