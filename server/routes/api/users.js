const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport'); // this is important
const bcrypt = require('bcrypt');
const { EMAIL_ADDRESS, EMAIL_PASSWORD } = require('../../../config');

// Bring in the user registration function
const {
  userRegister,
  checkRole,
  userLogin,
  auth,
} = require('../../controllers/Auth');
const User = require('../../models/User');

// Users registration
router.post('/register-user', async (req, res) => {
  await userRegister(req.body, 'user', res);
});

// Admin registration
router.post('/register-admin', async (req, res) => {
  await userRegister(req.body, 'admin', res);
});

// Users login
router.post('/login-user', async (req, res) => {
  await userLogin(req.body, 'user', res);
});

// Admin login
router.post('/login-admin', async (req, res) => {
  await userLogin(req.body, 'admin', res);
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const user = await User.find().populate('user');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Users protected
router.get('/user-protected', auth, checkRole(['user']), async (req, res) => {
  return res.json('Hello User');
});

// Admin protected
router.get('/admin-protected', auth, checkRole(['admin']), async (req, res) => {
  return res.json('Hello Admin');
});

// Forgot password rest
router.put('/forgot-password', async (req, res) => {
  if (req.body.email == '') {
    res.status(400).send('email required');
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(403).send('email is not in database');
  }

  const token = crypto.randomBytes(20).toString('hex');
  user.update({
    resetPasswordToken: token,
  });

  const transporter = nodemailer.createTransport(
    smtpTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: `${EMAIL_ADDRESS}`,
        pass: `${EMAIL_PASSWORD}`,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
  );

  const mailOptions = {
    from: 'spencerdu@hotmail.co.uk',
    to: `${user.email}`,
    subject: 'Link to Reset Password',
    text:
      'You are recieving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
      'Please click on the following link or paste this into your browser to complete the process:\n\n' +
      `http://localhost:3000/reset/${token}\n\n` +
      'If you did not request this, please ignore this email and your password will remain unchanged.\n',
  };

  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      console.error('there was an error: ', err);
    } else {
      console.log('here is the res: ', response);
      res.status(200).json('recovery email sent');
    }
  });
});

const BCRYPT_SALT_ROUNDS = 12;
router.put('/updatePasswordViaEmail', async (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
      resetPasswordToken: req.body.resetPasswordToken,
    },
  }).then((user) => {
    if (user == null) {
      console.error('password reset link is invalid or has expired');
      res.status(403).send('password reset link is invalid or has expired');
    } else if (user != null) {
      console.log('user exists in db');
      bcrypt
        .hash(req.body.password, BCRYPT_SALT_ROUNDS)
        .then((hashedPassword) => {
          User.update({
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null,
          });
        })
        .then(() => {
          console.log('password updated');
          res.status(200).send({ message: 'password updated' });
        });
    } else {
      console.error('no user exists in db to update');
      res.status(401).json('no user exists in db to update');
    }
  });
});

module.exports = router;
