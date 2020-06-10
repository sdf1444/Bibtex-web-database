const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Documents = require('../../models/Documents');
const User = require('../../models/User');

// @route   GET api/documents/me
// @desc    Get current users documents
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const documents = await (
      await Documents.findOne({ user: req.user.id })
    ).populate('user');

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
