const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Database = require('../../models/Database');
const User = require('../../models/User');

// @route   GET api/database/me
// @desc    Get current users database(s)
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const database = await Database.findOne({
      user: req.user.id,
    }).populate('user');

    if (!database) {
      return res
        .status(400)
        .json({ msg: 'There is no bibtex database(s) for this user' });
    }

    res.json(database);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/database
// @desc    Create or update user database(s)
// @access  Private
router.post('/', [auth], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { bibtexdatabasename } = req.body;

  const databaseFields = {
    user: req.user.id,
    bibtexdatabasename,
  };

  try {
    // Using upsert option (creates new doc if no match is found):
    let database = await Database.findOneAndUpdate(
      { user: req.user.id },
      { $set: databaseFields },
      { new: true, upsert: true }
    );
    res.json(database);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/database
// @desc    Get all database(s)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const database = await Database.find().populate('user');
    res.json(database);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/database/user/:user_id
// @desc    Get database(s) by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const database = await Database.findOne({
      user: req.params.user_id,
    }).populate('user');

    if (!database)
      return res.status(400).json({ msg: 'Database(s) not found' });

    res.json(database);
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
    await Database.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/database/article
// @desc    Add database(s) article(s)
// @access  Private
router.put(
  '/article',
  auth,
  [
    check('author', 'Author is required').not().isEmpty(),
    check('title', 'Title is required').not().isEmpty(),
    check('journal', 'Journal is required').not().isEmpty(),
    check('year', 'Year is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      key,
      author,
      title,
      journal,
      year,
      volume,
      number,
      pages,
      month,
    } = req.body;

    const newArticle = {
      key,
      author,
      title,
      journal,
      year,
      volume,
      number,
      pages,
      month,
    };

    try {
      const database = await Database.findOne({ user: req.user.id });

      database.article.unshift(newArticle);

      await database.save();

      res.json(database);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/database/book
// @desc    Add database(s) book(s)
// @access  Private
router.put(
  '/book',
  auth,
  [
    check('author', 'Author is required').not().isEmpty(),
    check('title', 'Title is required').not().isEmpty(),
    check('publisher', 'Publisher is required').not().isEmpty(),
    check('year', 'Year is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      key,
      author,
      title,
      publisher,
      year,
      volume,
      series,
      address,
      edition,
      month,
    } = req.body;

    const newBook = {
      key,
      author,
      title,
      publisher,
      year,
      volume,
      series,
      address,
      edition,
      month,
    };

    try {
      const database = await Database.findOne({ user: req.user.id });

      database.book.unshift(newBook);

      await database.save();

      res.json(database);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/database/booklet
// @desc    Add database(s) booklet(s)
// @access  Private
router.put('/booklet', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { key, title, author, howpublished, address, month, year } = req.body;

  const newBooklet = {
    key,
    title,
    author,
    howpublished,
    address,
    month,
    year,
  };

  try {
    const database = await Database.findOne({ user: req.user.id });

    database.booklet.unshift(newBooklet);

    await database.save();

    res.json(database);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/database/conference
// @desc    Add database(s) conference(s)
// @access  Private
router.put(
  '/conference',
  auth,
  [
    check('author', 'Author is required').not().isEmpty(),
    check('title', 'Title is required').not().isEmpty(),
    check('booktitle', 'Book title is required').not().isEmpty(),
    check('year', 'Year is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      key,
      author,
      title,
      booktitle,
      year,
      editor,
      volume,
      series,
      pages,
      address,
      month,
      organization,
      publisher,
    } = req.body;

    const newConference = {
      key,
      author,
      title,
      booktitle,
      year,
      editor,
      volume,
      series,
      pages,
      address,
      month,
      organization,
      publisher,
    };

    try {
      const database = await Database.findOne({ user: req.user.id });

      database.conference.unshift(newConference);

      await database.save();

      res.json(database);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/database/inBook
// @desc    Add database(s) inBook(s)
// @access  Private
router.put(
  '/inBook',
  auth,
  [
    check('author', 'Author is required').not().isEmpty(),
    check('title', 'Title is required').not().isEmpty(),
    check('chapter', 'Chapter is required').not().isEmpty(),
    check('publisher', 'Publisher is required').not().isEmpty(),
    check('year', 'Year is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      key,
      author,
      title,
      chapter,
      publisher,
      year,
      volume,
      series,
      type,
      address,
      edition,
      month,
    } = req.body;

    const newInBook = {
      key,
      author,
      title,
      chapter,
      publisher,
      year,
      volume,
      series,
      type,
      address,
      edition,
      month,
    };

    try {
      const database = await Database.findOne({ user: req.user.id });

      database.inBook.unshift(newInBook);

      await database.save();

      res.json(database);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/database/inCollection
// @desc    Add database(s) inCollection(s)
// @access  Private
router.put(
  '/inCollection',
  auth,
  [
    check('author', 'Author is required').not().isEmpty(),
    check('title', 'Title is required').not().isEmpty(),
    check('booktitle', 'Book title is required').not().isEmpty(),
    check('publisher', 'Publisher is required').not().isEmpty(),
    check('year', 'Year is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      key,
      author,
      title,
      booktitle,
      publisher,
      year,
      editor,
      volume,
      series,
      type,
      chapter,
      pages,
      address,
      edition,
      organization,
      month,
    } = req.body;

    const newInCollection = {
      key,
      author,
      title,
      booktitle,
      publisher,
      year,
      editor,
      volume,
      series,
      type,
      chapter,
      pages,
      address,
      edition,
      organization,
      publisher,
      month,
    };

    try {
      const database = await Database.findOne({ user: req.user.id });

      database.inCollection.unshift(newInCollection);

      await database.save();

      res.json(database);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/database/inProceedings
// @desc    Add database(s) inProceedings
// @access  Private
router.put(
  '/inProceedings',
  auth,
  [
    check('author', 'Author is required').not().isEmpty(),
    check('title', 'Title is required').not().isEmpty(),
    check('booktitle', 'Book title is required').not().isEmpty(),
    check('year', 'Year is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      key,
      author,
      title,
      booktitle,
      year,
      editor,
      volume,
      series,
      pages,
      address,
      month,
      organization,
      publisher,
    } = req.body;

    const newInProceedings = {
      key,
      author,
      title,
      booktitle,
      year,
      editor,
      volume,
      series,
      pages,
      address,
      month,
      organization,
      publisher,
    };

    try {
      const database = await Database.findOne({ user: req.user.id });

      database.inProceedings.unshift(newInProceedings);

      await database.save();

      res.json(database);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/database/manual
// @desc    Add database(s) manual(s)
// @access  Private
router.put(
  '/manual',
  auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('author', 'Author is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      key,
      title,
      author,
      organization,
      address,
      edition,
      month,
      year,
    } = req.body;

    const newManual = {
      key,
      title,
      author,
      organization,
      address,
      edition,
      month,
      year,
    };

    try {
      const database = await Database.findOne({ user: req.user.id });

      database.manual.unshift(newManual);

      await database.save();

      res.json(database);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/database/mastersThesis
// @desc    Add database(s) masterThesis
// @access  Private
router.put('/mastersThesis', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { key, author, title, school, year, type, address, month } = req.body;

  const newMastersThesis = {
    key,
    author,
    title,
    school,
    year,
    type,
    address,
    month,
  };

  try {
    const database = await Databases.findOne({ user: req.user.id });

    database.mastersThesis.unshift(newMastersThesis);

    await database.save();

    res.json(database);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/database/misc
// @desc    Add database(s) misc(s)
// @access  Private
router.put('/misc', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { key, author, title, howpublished, month, year } = req.body;

  const newMisc = {
    key,
    author,
    title,
    howpublished,
    month,
    year,
  };

  try {
    const database = await Database.findOne({ user: req.user.id });

    database.misc.unshift(newMisc);

    await database.save();

    res.json(database);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/database/online
// @desc    Add database(s) online(s)
// @access  Private
router.put('/online', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { key, author, title, month, year, url } = req.body;

  const newOnline = {
    key,
    author,
    title,
    month,
    year,
    url,
  };

  try {
    const database = await Database.findOne({ user: req.user.id });

    database.online.unshift(newOnline);

    await database.save();

    res.json(database);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/database/phdThesis
// @desc    Add database(s) phdThesis
// @access  Private
router.put(
  '/phdThesis',
  auth,
  [
    check('author', 'Author is required').not().isEmpty(),
    check('title', 'Title is required').not().isEmpty(),
    check('school', 'School is required').not().isEmpty(),
    check('year', 'Year is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { key, author, title, school, year, type, address, month } = req.body;

    const newPhdThesis = {
      key,
      author,
      title,
      school,
      year,
      type,
      address,
      month,
    };

    try {
      const database = await Database.findOne({ user: req.user.id });

      database.phdThesis.unshift(newPhdThesis);

      await database.save();

      res.json(database);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/database/proceedings
// @desc    Add database(s) proceedings
// @access  Private
router.put(
  '/proceedings',
  auth,
  [
    check('title', 'Title is required').not().isEmpty(),
    check('year', 'Year is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      key,
      title,
      year,
      editor,
      volume,
      series,
      address,
      month,
      publisher,
      organization,
    } = req.body;

    const newProceedings = {
      key,
      title,
      year,
      editor,
      volume,
      series,
      address,
      month,
      publisher,
      organization,
    };

    try {
      const database = await Database.findOne({ user: req.user.id });

      database.proceedings.unshift(newProceedings);

      await database.save();

      res.json(database);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
