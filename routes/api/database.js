const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Database = require('../../models/Database');
const User = require('../../models/User');
const checkObjectId = require('../../middleware/checkObjectId');

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

  try {
    const user = await User.findById(req.user.id).select('-password');

    const newDatabase = new Database({
      bibtexdatabasename: req.body.bibtexdatabasename,
      user: req.user.id,
    });

    const database = await newDatabase.save();

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
    const database = await Database.find();
    res.json(database);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/database/:id
// @desc    Delete database(s)
// @access  Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const database = await Database.findById(req.params.id);

    // Check user
    if (database.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await database.remove();

    res.json({ msg: 'Database removed' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// Update reference
router.put('/reference/:id', (req, res, next) => {
  Database.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        res.status(500).send('Server Error');
        console.log(error);
      } else {
        res.json(data);
        console.log('Reference updated successfully!');
      }
    }
  );
});

router.post('/upload', [auth], async (req, res) => {
  let database = await Database.findOne({
    bibtexdatabasename: req.body.bibtexdatabasename,
  }).exec();
  if (!database) {
    let newDatabase = new Database(req.body);
    newDatabase.user = req.user.id;
    newDatabase.save();
    res.json(newDatabase);
  } else {
    for (let key of Object.keys(database.toObject())) {
      if (key === 'bibtexdatabasename' || key === 'user' || key === '_id')
        continue;
      if (!req.body[key]) continue;
      for (let ref of req.body[key]) {
        let contains = false;
        console.log('DATABASE');
        console.log(database[key]);
        console.log('REF');
        console.log(ref);
        for (let i in database[key]) {
          if (database[key][i].key.toLowerCase() === ref.key.toLowerCase()) {
            contains = true;
            for (let key2 of Object.keys(ref)) {
              database[key][i][key2] = ref[key2];
            }
            console.log('changed');
          }
        }
        if (!contains) {
          database[key].push(ref);
        }
      }
    }
    await database.save();
    return res.json(database);
  }
});

// @route   POST api/database/article/:id
// @desc    Add article(s) to database(s)
// @access  Private
router.post(
  '/article/:id',
  [
    auth,
    checkObjectId('id'),
    [
      check('author', 'Author is required').not().isEmpty(),
      check('title', 'Title is required').not().isEmpty(),
      check('journal', 'Journal is required').not().isEmpty(),
      check('year', 'Year is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id).select('-password');
    const database = await Database.findById(req.params.id);

    try {
      const newArticle = {
        key: req.body.key,
        author: req.body.author,
        title: req.body.title,
        journal: req.body.journal,
        year: req.body.year,
        volume: req.body.volume,
        number: req.body.number,
        pages: req.body.pages,
        month: req.body.month,
        user: req.user.id,
      };

      database.article.unshift(newArticle);

      await database.save();

      res.json(database.article);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/database/article/:id/:article_id
// @desc    Delete article from database
// @access  Private
router.delete('/article/:id/:article_id', auth, async (req, res) => {
  try {
    const database = await Database.findById(req.params.id);

    // Pull out article
    const article = database.article.find(
      (article) => article.id === req.params.article_id
    );
    // Make sure article exists
    if (!article) {
      return res.status(404).json({ msg: 'Article does not exist' });
    }

    if (article.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    database.article = database.article.filter(
      ({ id }) => id !== req.params.article_id
    );

    await database.save();

    return res.json(database.article);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route   POST api/database/book/:id
// @desc    Add book(s) into database(s)
// @access  Private
router.post(
  '/book/:id',
  auth,
  checkObjectId('id'),
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

    const user = await User.findById(req.user.id).select('-password');
    const database = await Database.findById(req.params.id);

    try {
      const newBook = {
        key: req.body.key,
        author: req.body.author,
        title: req.body.title,
        publisher: req.body.publisher,
        year: req.body.year,
        volume: req.body.volume,
        series: req.body.series,
        address: req.body.address,
        edition: req.body.edition,
        month: req.body.month,
        user: req.user.id,
      };

      database.book.unshift(newBook);

      await database.save();

      res.json(database.book);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/database/book/:id/:book_id
// @desc    Delete book from database
// @access  Private
router.delete('/book/:id/:book_id', auth, async (req, res) => {
  try {
    const database = await Database.findById(req.params.id);

    // Pull out book
    const book = database.book.find((book) => book.id === req.params.book_id);
    // Make sure book exists
    if (!book) {
      return res.status(404).json({ msg: 'Book does not exist' });
    }

    if (book.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    database.book = database.book.filter(({ id }) => id !== req.params.book_id);

    await database.save();

    return res.json(database.book);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route   POST api/database/booklet/:id
// @desc    Add database(s) booklet(s)
// @access  Private
router.post('/booklet/:id', auth, checkObjectId('id'), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await User.findById(req.user.id).select('-password');
  const database = await Database.findById(req.params.id);

  try {
    const newBooklet = {
      key: req.body.key,
      title: req.body.title,
      author: req.body.author,
      howpublished: req.body.howpublished,
      address: req.body.address,
      month: req.body.month,
      year: req.body.year,
      user: req.user.id,
    };

    database.booklet.unshift(newBooklet);

    await database.save();

    res.json(database.booklet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/database/booklet/:id/:booklet_id
// @desc    Delete booklet from database
// @access  Private
router.delete('/booklet/:id/:booklet_id', auth, async (req, res) => {
  try {
    const database = await Database.findById(req.params.id);

    // Pull out booklet
    const booklet = database.booklet.find(
      (booklet) => booklet.id === req.params.booklet_id
    );
    // Make sure booklet exists
    if (!booklet) {
      return res.status(404).json({ msg: 'Booklet does not exist' });
    }

    if (booklet.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    database.booklet = database.booklet.filter(
      ({ id }) => id !== req.params.booklet_id
    );

    await database.save();

    return res.json(database.booklet);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route   POST api/database/conference/:id
// @desc    Add database(s) conference(s)
// @access  Private
router.post(
  '/conference/:id',
  auth,
  checkObjectId('id'),
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

    const user = await User.findById(req.user.id).select('-password');
    const database = await Database.findById(req.params.id);

    try {
      const newConference = {
        key: req.body.key,
        title: req.body.title,
        author: req.body.author,
        booktitle: req.body.booktitle,
        year: req.body.year,
        editor: req.body.editor,
        volume: req.body.volume,
        series: req.body.series,
        pages: req.body.pages,
        address: req.body.address,
        month: req.body.month,
        organization: req.body.organization,
        publisher: req.body.publisher,
        user: req.user.id,
      };

      database.conference.unshift(newConference);

      await database.save();

      res.json(database.conference);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/database/conference/:id/:conference_id
// @desc    Delete conference from database
// @access  Private
router.delete('/conference/:id/:conference_id', auth, async (req, res) => {
  try {
    const database = await Database.findById(req.params.id);

    // Pull out conference
    const conference = database.conference.find(
      (conference) => conference.id === req.params.conference_id
    );
    // Make sure conference exists
    if (!conference) {
      return res.status(404).json({ msg: 'Conference does not exist' });
    }

    if (conference.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    database.conference = database.conference.filter(
      ({ id }) => id !== req.params.conference_id
    );

    await database.save();

    return res.json(database.conference);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route   POST api/database/inBook/:id
// @desc    Add database(s) inBook(s)
// @access  Private
router.post(
  '/inBook/:id',
  auth,
  checkObjectId('id'),
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

    const user = await User.findById(req.user.id).select('-password');
    const database = await Database.findById(req.params.id);

    try {
      const newInBook = {
        key: req.body.key,
        title: req.body.title,
        author: req.body.author,
        chapter: req.body.chapter,
        publisher: req.body.publisher,
        year: req.body.year,
        volume: req.body.volume,
        series: req.body.series,
        type: req.body.type,
        address: req.body.address,
        edition: req.body.edition,
        month: req.body.month,
        user: req.user.id,
      };

      database.inBook.unshift(newInBook);

      await database.save();

      res.json(database.inBook);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/database/inBook/:id/:inBook_id
// @desc    Delete inBook from database
// @access  Private
router.delete('/inBook/:id/:inBook_id', auth, async (req, res) => {
  try {
    const database = await Database.findById(req.params.id);

    // Pull out inBook
    const inBook = database.inBook.find(
      (inBook) => inBook.id === req.params.inBook_id
    );
    // Make sure inBook exists
    if (!inBook) {
      return res.status(404).json({ msg: 'InBook does not exist' });
    }

    if (inBook.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    database.inBook = database.inBook.filter(
      ({ id }) => id !== req.params.inBook_id
    );

    await database.save();

    return res.json(database.inBook);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route   POST api/database/inCollection/:id
// @desc    Add database(s) inCollection(s)
// @access  Private
router.post(
  '/inCollection/:id',
  auth,
  checkObjectId('id'),
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

    const user = await User.findById(req.user.id).select('-password');
    const database = await Database.findById(req.params.id);

    try {
      const newInCollection = {
        key: req.body.key,
        title: req.body.title,
        author: req.body.author,
        booktitle: req.body.booktitle,
        publisher: req.body.publisher,
        year: req.body.year,
        editor: req.body.editor,
        volume: req.body.volume,
        series: req.body.series,
        type: req.body.type,
        chapter: req.body.chapter,
        pages: req.body.pages,
        address: req.body.address,
        edition: req.body.edition,
        organization: req.body.organization,
        month: req.body.month,
        user: req.user.id,
      };

      database.inCollection.unshift(newInCollection);

      await database.save();

      res.json(database.inCollection);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/database/inCollection/:id/:inCollection_id
// @desc    Delete inCollection from database
// @access  Private
router.delete('/inCollection/:id/:inCollection_id', auth, async (req, res) => {
  try {
    const database = await Database.findById(req.params.id);

    // Pull out inCollection
    const inCollection = database.inCollection.find(
      (inCollection) => inCollection.id === req.params.inCollection_id
    );
    // Make sure inCollection exists
    if (!inCollection) {
      return res.status(404).json({ msg: 'InCollection does not exist' });
    }

    if (inCollection.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    database.inCollection = database.inCollection.filter(
      ({ id }) => id !== req.params.inCollection_id
    );

    await database.save();

    return res.json(database.inCollection);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route   POST api/database/inProceedings/:id
// @desc    Add database(s) inProceedings
// @access  Private
router.post(
  '/inProceedings/:id',
  auth,
  checkObjectId('id'),
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

    const user = await User.findById(req.user.id).select('-password');
    const database = await Database.findById(req.params.id);

    try {
      const newInProceedings = {
        key: req.body.key,
        title: req.body.title,
        author: req.body.author,
        booktitle: req.body.booktitle,
        year: req.body.year,
        editor: req.body.editor,
        volume: req.body.volume,
        series: req.body.series,
        pages: req.body.pages,
        address: req.body.address,
        month: req.body.month,
        organization: req.body.organization,
        publisher: req.body.publisher,
        user: req.user.id,
      };

      database.inProceedings.unshift(newInProceedings);

      await database.save();

      res.json(database.inProceedings);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/database/inProceedings/:id/:inProceedings_id
// @desc    Delete inProceedings from database
// @access  Private
router.delete(
  '/inProceedings/:id/:inProceedings_id',
  auth,
  async (req, res) => {
    try {
      const database = await Database.findById(req.params.id);

      // Pull out inProceedings
      const inProceedings = database.inProceedings.find(
        (inProceedings) => inProceedings.id === req.params.inProceedings_id
      );
      // Make sure inProceedings exists
      if (!inProceedings) {
        return res.status(404).json({ msg: 'InProceedings does not exist' });
      }

      if (inProceedings.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }

      database.inProceedings = database.inProceedings.filter(
        ({ id }) => id !== req.params.inProceedings_id
      );

      await database.save();

      return res.json(database.inProceedings);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/database/manual/:id
// @desc    Add database(s) manual(s)
// @access  Private
router.post(
  '/manual/:id',
  auth,
  checkObjectId('id'),
  [
    check('title', 'Title is required').not().isEmpty(),
    check('author', 'Author is required').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id).select('-password');
    const database = await Database.findById(req.params.id);

    try {
      const newManual = {
        key: req.body.key,
        title: req.body.title,
        author: req.body.author,
        organization: req.body.organization,
        address: req.body.address,
        edition: req.body.edition,
        month: req.body.month,
        year: req.body.year,
        user: req.user.id,
      };

      database.manual.unshift(newManual);

      await database.save();

      res.json(database.manual);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/database/manual/:manual_id
// @desc    Delete manual from database
// @access  Private
router.delete('/manual/:id/:manual_id', auth, async (req, res) => {
  try {
    const database = await Database.findById(req.params.id);

    // Pull out manual
    const manual = database.manual.find(
      (manual) => manual.id === req.params.manual_id
    );
    // Make sure manual exists
    if (!manual) {
      return res.status(404).json({ msg: 'Manual does not exist' });
    }

    if (manual.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    database.manual = database.manual.filter(
      ({ id }) => id !== req.params.manual_id
    );

    await database.save();

    return res.json(database.manual);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route   POST api/database/mastersThesis/:id
// @desc    Add database(s) masterThesis
// @access  Private
router.post(
  '/mastersThesis/:id',
  auth,
  checkObjectId('id'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id).select('-password');
    const database = await Database.findById(req.params.id);

    try {
      const newMastersThesis = {
        key: req.body.key,
        title: req.body.title,
        author: req.body.author,
        school: req.body.school,
        year: req.body.year,
        type: req.body.type,
        address: req.body.address,
        month: req.body.month,
        user: req.user.id,
      };

      database.mastersThesis.unshift(newMastersThesis);

      await database.save();

      res.json(database.mastersThesis);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/database/mastersThesis/:id/:mastersThesis_id
// @desc    Delete mastersThesis from database
// @access  Private
router.delete(
  '/mastersThesis/:id/:mastersThesis_id',
  auth,
  async (req, res) => {
    try {
      const database = await Database.findById(req.params.id);

      // Pull out mastersThesis
      const mastersThesis = database.mastersThesis.find(
        (mastersThesis) => mastersThesis.id === req.params.mastersThesis_id
      );
      // Make sure manual exists
      if (!mastersThesis) {
        return res.status(404).json({ msg: 'Masters Thesis does not exist' });
      }

      if (mastersThesis.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }

      database.mastersThesis = database.mastersThesis.filter(
        ({ id }) => id !== req.params.mastersThesis_id
      );

      await database.save();

      return res.json(database.mastersThesis);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

// @route   POST api/database/misc/:id
// @desc    Add database(s) misc(s)
// @access  Private
router.post('/misc/:id', auth, checkObjectId('id'), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await User.findById(req.user.id).select('-password');
  const database = await Database.findById(req.params.id);

  try {
    const newMisc = {
      key: req.body.key,
      title: req.body.title,
      author: req.body.author,
      howpublished: req.body.howpublished,
      month: req.body.month,
      year: req.body.year,
      user: req.user.id,
    };

    database.misc.unshift(newMisc);

    await database.save();

    res.json(database.misc);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/database/misc/:id/:misc_id
// @desc    Delete misc from database
// @access  Private
router.delete('/misc/:id/:misc_id', auth, async (req, res) => {
  try {
    const database = await Database.findById(req.params.id);

    // Pull out misc
    const misc = database.misc.find((misc) => misc.id === req.params.misc_id);
    // Make sure misc exists
    if (!misc) {
      return res.status(404).json({ msg: 'Misc does not exist' });
    }

    if (misc.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    database.misc = database.misc.filter(({ id }) => id !== req.params.misc_id);

    await database.save();

    return res.json(database.misc);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route   POST api/database/online/:id
// @desc    Add database(s) online(s)
// @access  Private
router.post('/online/:id', auth, checkObjectId('id'), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await User.findById(req.user.id).select('-password');
  const database = await Database.findById(req.params.id);

  try {
    const newOnline = {
      key: req.body.key,
      title: req.body.title,
      author: req.body.author,
      month: req.body.month,
      year: req.body.year,
      url: req.body.url,
      user: req.user.id,
    };

    database.online.unshift(newOnline);

    await database.save();

    res.json(database.online);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/database/online/:id/:online_id
// @desc    Delete online from database
// @access  Private
router.delete('/online/:id/:online_id', auth, async (req, res) => {
  try {
    const database = await Database.findById(req.params.id);

    // Pull out online
    const online = database.online.find(
      (online) => online.id === req.params.online_id
    );
    // Make sure online exists
    if (!online) {
      return res.status(404).json({ msg: 'Online does not exist' });
    }

    if (online.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    database.online = database.online.filter(
      ({ id }) => id !== req.params.online_id
    );

    await database.save();

    return res.json(database.online);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route   POST api/database/phdThesis/:id
// @desc    Add database(s) phdThesis
// @access  Private
router.post(
  '/phdThesis/:id',
  auth,
  checkObjectId('id'),
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

    const user = await User.findById(req.user.id).select('-password');
    const database = await Database.findById(req.params.id);

    try {
      const newPhdThesis = {
        key: req.body.key,
        title: req.body.title,
        author: req.body.author,
        school: req.body.school,
        year: req.body.year,
        type: req.body.type,
        address: req.body.address,
        month: req.body.month,
        user: req.user.id,
      };

      database.phdThesis.unshift(newPhdThesis);

      await database.save();

      res.json(database.phdThesis);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/database/phdThesis/:id/:phdThesis_id
// @desc    Delete phdThesis from database
// @access  Private
router.delete('/phdThesis/:id/:phdThesis_id', auth, async (req, res) => {
  try {
    const database = await Database.findById(req.params.id);

    // Pull out phdThesis
    const phdThesis = database.phdThesis.find(
      (phdThesis) => phdThesis.id === req.params.phdThesis_id
    );
    // Make sure phdThesis exists
    if (!phdThesis) {
      return res.status(404).json({ msg: 'Phd Thesis does not exist' });
    }

    if (phdThesis.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    database.phdThesis = database.phdThesis.filter(
      ({ id }) => id !== req.params.phdThesis_id
    );

    await database.save();

    return res.json(database.phdThesis);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route   POST api/database/proceedings/:id
// @desc    Add database(s) proceedings
// @access  Private
router.post(
  '/proceedings/:id',
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

    const user = await User.findById(req.user.id).select('-password');
    const database = await Database.findById(req.params.id);

    try {
      const newProceedings = {
        key: req.body.key,
        title: req.body.title,
        year: req.body.year,
        editor: req.body.editor,
        volume: req.body.volume,
        series: req.body.series,
        address: req.body.address,
        month: req.body.month,
        publisher: req.body.publisher,
        organization: req.body.organization,
        user: req.user.id,
      };

      database.proceedings.unshift(newProceedings);

      await database.save();

      res.json(database.proceedings);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/database/proceedings/:id/:proceedings_id
// @desc    Delete proceedings from database
// @access  Private
router.delete('/proceedings/:id/:proceedings_id', auth, async (req, res) => {
  try {
    const database = await Database.findById(req.params.id);

    // Pull out proceedings
    const proceedings = database.proceedings.find(
      (proceedings) => proceedings.id === req.params.proceedings_id
    );
    // Make sure proceedings exists
    if (!proceedings) {
      return res.status(404).json({ msg: 'Proceedings does not exist' });
    }

    if (proceedings.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    database.proceedings = database.proceedings.filter(
      ({ id }) => id !== req.params.proceedings_id
    );

    await database.save();

    return res.json(database.proceedings);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
