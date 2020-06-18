const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route   GET api/users
// @desc    Get all users
// @access  Public
router.get('/', async (req, res) => {
  try {
    const user = await User.find().populate('user');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users/register-user
// @desc    Register user
// @access  Public
router.post(
  '/register-user',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, role, username, password } = req.body;

    try {
      let user = await User.findOne({ username });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new User({
        name,
        email,
        role,
        username,
        password,
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, config.get('jwtSecret'), (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

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
  User.update({
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

// Update password via email
const BCRYPT_SALT_ROUNDS = 12;
router.put('/updatePasswordViaEmail', (req, res) => {
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
