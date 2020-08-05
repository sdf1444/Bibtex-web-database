const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');

// @route GET api/auth
// @desc Get user by token
// @access Private
router.get('/', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.data = user;
    return next();
  } catch (err) {
    res.data = { err: err.message };
    return next();
  }
});

// @route POST api/auth
// @desc Authenticate user & get token
// @access Public
router.post(
  '/',
  [
    check('username', 'Username is required').exists(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    try {
      let user = await User.findOne({ username });
      if (!user) {
        res.data = { err: 'Invalid Username' };
        return next();
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.data = { err: 'Invalid Password' };
        return next();
      }
      const payload = {
        user: {
          id: user.id,
        },
      };
      const role = user.role;
      token = jwt.sign(payload, config.jwtSecret);
      res.data = { token, role };
      return next();
    } catch (err) {
      console.error(err.message);
      res.data = { err: err.message };
      return next();
    }
  }
);

module.exports = router;
