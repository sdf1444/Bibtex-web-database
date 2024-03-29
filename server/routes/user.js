const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config');
const { check, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const User = require('../models/User');
const { error } = require('console');

// @route     POST api/users/register-user
// @desc        Register user
// @access    Admin
router.post(
  '/register-user',
  auth,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('role', 'Role is required').not().isEmpty(),
    check('username', 'Username is required').not().isEmpty(),
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

    const admin = await User.findById(req.user.id);
    if (admin.role !== 'admin') {
      return res.status(403).json({ error: 'You are not admin' });
    }

    const { name, email, role, username, password } = req.body;

    try {
      let userEmail = await User.findOne({ email });
      let userUsername = await User.findOne({ username });

      if (userEmail) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Email already registered' }] });
      }

      if (userUsername) {
        return res.status(400).json({ errors: [{ msg: 'Username taken' }] });
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
      jwt.sign(payload, config.jwtSecret, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route     GET api/user/me
// @desc        Get current user
// @access    Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     GET api/user
// @desc        Get all users
// @access    Public
router.get('/', async (req, res) => {
  const username = req.query.username;
  var condition = username
    ? { username: { $regex: new RegExp(username), $options: 'i' } }
    : {};

  User.find(condition)
    .select('-password')
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving users',
      });
    });
});

// @route     GET api/user/:id
// @desc      Get a single user
// @access    Admin
router.get('/:id', auth, async (req, res, next) => {
  const admin = await User.findById(req.user.id);
  if (admin.role !== 'admin') {
    return res.status(403).json({ error: 'You are not admin' });
  }
  const user = await User.findById(req.params.id).select('-password');
  res.json(user);
});

// @route     PUT api/user/:id
// @desc      Update user
// @access    Admin access only
router.put('/:id', auth, async (req, res, next) => {
  console.log('STARTED UPDATING');
  const admin = await User.findById(req.user.id);
  if (admin.role !== 'admin') {
    res.data = { err: 'You are not admin' };
    return next();
  }
  const updatedUser = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    username: req.body.username,
  };
  const anotherUser = await User.findOne({ username: updatedUser.username });
  if (anotherUser && anotherUser._id.toString() !== req.params.id.toString()) {
    res.data = { err: 'User with this username already exists' };
    return next();
  }
  const emailCheck = await User.findOne({ email: updatedUser.email });
  if (emailCheck && emailCheck._id.toString() !== req.params.id.toString()) {
    res.data = { err: 'User with this email already exists' };
    return next();
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.data = { err: 'User with this id does not exist' };
      return next();
    }
    user.name = updatedUser.name;
    user.email = updatedUser.email;
    user.role = updatedUser.role;
    user.username = updatedUser.username;
    const newUser = await user.save();
    res.data = newUser;
    return next();
  } catch (err) {
    res.data = { err: err.message || err.errmsg };
    return next();
  }
});

// @route     DELETE api/user/:id
// @desc        Delete user
// @access    Admin access only
router.delete('/:id', auth, async (req, res) => {
  const admin = await User.findById(req.user.id);
  if (admin.role !== 'admin') {
    return res.status(403).json({ error: 'You are not admin' });
  }
  User.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.json({
        success: true,
        msg: `It has been deleted.`,
        result: {
          _id: result._id,
          name: result.name,
          email: result.email,
          role: result.role,
          username: result.username,
          password: result.password,
        },
      });
    })
    .catch((err) => {
      res.status(404).json({ success: false, msg: 'Nothing to delete.' });
    });
});

router.post('/:email', async (req, res) => {
  const { email } = req.params;
  let user;
  try {
    user = await User.findOne({ email });

    user.save(function (err) {
      if (err) {
        return res.status(500).send({ message: err.message });
      }
    });

    const transporter = nodemailer.createTransport(
      smtpTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
          user: config.email_address,
          pass: config.email_password,
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
        `https://super-nougat-7e741e.netlify.app/reset/${user._id}\n\n` +
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
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.put('/updatePassword/:id', async (req, res) => {
  let updatePassword = {
    password: bcrypt.hashSync(req.body.password, 10),
  };

  User.findOneAndUpdate({ _id: req.params.id }, updatePassword, {
    runValidators: true,
    context: 'query',
  })
    .then((oldResult) => {
      User.findOne({ _id: req.params.id })
        .then((newResult) => {
          res.json({
            success: true,
            msg: `Successfully updated!`,
          });
        })
        .catch((err) => {
          res
            .status(500)
            .json({ success: false, msg: `Something went wrong. ${err}` });
          return;
        });
    })
    .catch((err) => {
      if (err.errors) {
        if (err.errors.password) {
          res.status(400).json({ success: false, msg: err.errors.password });
        }
      }
    });
});

module.exports = router;
