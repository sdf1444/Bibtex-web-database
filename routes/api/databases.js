const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Databases = require('../../models/Databases');
const User = require('../../models/User');

// @route   GET api/databases/me
// @desc    Get current users databases
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const databases = await Databases.findOne({
      user: req.user.id,
    }).populate('user');

    if (!databases) {
      return res
        .status(400)
        .json({ msg: 'There is no bibtex database(s) for this user' });
    }

    res.json(databases);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/databases
// @desc    Create or update user database(s)
// @access  Private
router.post('/', [auth], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { bibtexdatabasename } = req.body;

  const databasesFields = {
    user: req.user.id,
    bibtexdatabasename,
  };

  try {
    // Using upsert option (creates new doc if no match is found):
    let databases = await Databases.findOneAndUpdate(
      { user: req.user.id },
      { $set: databasesFields },
      { new: true, upsert: true }
    );
    res.json(databases);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/databases
// @desc    Get all database(s)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const databases = await Databases.find().populate('user');
    res.json(databases);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/databases/user/:user_id
// @desc    Get database(s) by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const databases = await Documents.findOne({
      user: req.params.user_id,
    }).populate('user');

    if (!databases)
      return res.status(400).json({ msg: 'Database(s) not found' });

    res.json(databases);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Database(s) not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/database
// @desc    Delete database(s) and user
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove database(s)
    await Databases.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
