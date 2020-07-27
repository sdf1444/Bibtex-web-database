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
const { getMaxListeners } = require('../models/User');

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
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Email already registered' }] });
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
// @desc        Get a single user
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
router.put('/:id', auth, async (req, res) => {
  const admin = await User.findById(req.user.id);
  if (admin.role !== 'admin') {
    return res.status(403).json({ error: 'You are not admin' });
  }
  let updatedUser = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    username: req.body.username,
  };

  User.findOneAndUpdate({ _id: req.params.id }, updatedUser, {
    runValidators: true,
    context: 'query',
  })
    .then((oldResult) => {
      User.findOne({ _id: req.params.id })
        .then((newResult) => {
          res.json({
            success: true,
            msg: `Successfully updated!`,
            result: {
              _id: newResult._id,
              name: newResult.name,
              email: newResult.email,
              role: newResult.role,
              username: newResult.username,
            },
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
        if (err.errors.name) {
          res
            .status(400)
            .json({ success: false, msg: error.errors.name.message });
          return;
        }
        if (err.errors.email) {
          res
            .status(400)
            .json({ success: false, msg: err.errors.email.message });
          return;
        }
        if (err.erros.role) {
          res.status(400).json({ success: false, msg: err.erros.role });
        }
        if (err.errors.username) {
          res.status(400).json({ success: false, msg: err.errors.username });
        }
        if (err.errors.password) {
          res.status(400).json({ success: false, msg: err.errors.password });
        }
      }
    });
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

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'bibtexwebdatabase@googlemail.com',
        pass: 'boggie234',
      },
    });

    const mailOptions = {
      from: 'bibtexwebdatabase@googlemail.com',
      to: `${user.email}`,
      subject: 'Bibtex web database password reset link',
      text:
        'You are recieving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link or paste this into your browser to complete the process:\n\n' +
        `https://peaceful-earth-10434.herokuapp.com/reset/${user._id}\n\n` +
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
