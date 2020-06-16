const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport'); // this is important
const bcrypt = require('bcrypt');
const {
  EMAIL_ADDRESS,
  EMAIL_PASSWORD,
  RESET_PASSWORD,
} = require('../../../config');

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

  const token = jwt.sign({ _id: user._id }, `${RESET_PASSWORD}`);
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

  return user.updateOne({ resetLink: token }, (err, success) => {
    if (err) {
      return res.status(400).json({ error: 'reset password link error' });
    } else {
      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.error('there was an error: ', err);
        } else {
          console.log('here is the res: ', response);
          res.status(200).json('recovery email sent');
        }
      });
    }
  });
});

router.put('/reset-password', (req, res) => {
  const { resetLink, newPass } = req.body;
  if (resetLink) {
    jwt.verify(resetLink, `${RESET_PASSWORD}`, (error, decodedData) => {
      if (error) {
        return res.status(401).json({
          error: 'Incorrect token or it is expired.',
        });
      }
      User.findOne({ resetLink }, (err, user) => {
        if (err || !user) {
          return res
            .status(400)
            .json({ error: 'User with this token does not exist.' });
        }

        const obj = {
          password: newPass,
        };

        user = _.extend(user, obj);
        user.save((err, result) => {
          if (err) {
            return res.status(400).json({ error: 'reset password link error' });
          } else {
            res.status(200).json({ message: 'Your password has bee changed' });
          }
        });
      });
    });
  } else {
    return res.status(401).json({ error: 'Authentication error' });
  }
});

module.exports = router;
