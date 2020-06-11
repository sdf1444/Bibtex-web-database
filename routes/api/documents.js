const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Documents = require('../../models/Documents');
const User = require('../../models/User');

// @route   GET api/documents/me
// @desc    Get current users documents
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const documents = await Documents.findOne({
      user: req.user.id,
    }).populate('user');

    if (!documents) {
      return res
        .status(400)
        .json({ msg: 'There is no bibtex database document(s) for this user' });
    }

    res.json(documents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/documents
// @desc    Create or update user document(s)
// @access  Private
router.post('/', [auth], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {} = req.body;

  const documentsFields = {
    user: req.user.id,
  };

  try {
    // Using upsert option (creates new doc if no match is found):
    let documents = await Documents.findOneAndUpdate(
      { user: req.user.id },
      { $set: documentsFields },
      { new: true, upsert: true }
    );
    res.json(documents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
