const express = require('express');
const auth = require('../middleware/auth');
const Database = require('../models/Database');
const Entry = require('../models/Entry');
const User = require('../models/User');
const { updateEntry } = require('../services/entry');

const router = express.Router();

// @route GET api/database/me
// @desc Get user's databases
router.get('/me', auth, async (req, res, next) => {
  const databases = await Database.find({ user: req.user.id }).populate(
    'entries'
  );
  res.data = databases;
  return next();
});

// @route GET api/database
// @desc Get all databases
router.get('/', async (req, res, next) => {
  const databases = await Database.find({}).populate('entries');
  res.data = databases;
  return next();
});

// @route GET api/database/entries
// @desc Get all entries
router.get('/entries', async (req, res, next) => {
  const entries = await Entry.find({});
  res.data = entries;
  return next();
});

// @route POST api/database
// @desc Create empty database with no entries
router.post('/', auth, async (req, res, next) => {
  try {
    const newDatabase = new Database({
      bibtexdatabasename: req.body.bibtexdatabasename,
      user: req.user.id,
    });
    const database = await newDatabase.save();
    res.data = database;
    return next();
  } catch (err) {
    console.log(err.message);
    res.data = { err: err.message };
    return next();
  }
});

// @route DELETE api/database
// @desc Delete database
router.delete('/', auth, async (req, res, next) => {
  if (!req.body.id) {
    res.data = { err: 'Database id missing' };
    return next();
  }
  const database = await Database.findById(req.body.id);
  if (!database) {
    res.data = { err: 'Database with this id does not exist' };
    return next();
  }
  if (database.user.toString() !== req.user.id) {
    res.data = { err: 'Database does not belong to this user', status: 401 };
    return next();
  }
  await database.remove();
  res.data = database;
  return next();
});

// @route PUT api/database/entry
// @desc Update database entry
router.put('/entry', auth, async (req, res, next) => {
  if (!req.body.id) {
    res.data = { err: 'Entry id missing' };
    return next();
  }
  if (!req.body.citationKey && !req.body.entryTags) {
    res.data = { err: 'Citation Key or Entry Tags missing' };
    return next();
  }
  const entry = await Entry.findById(req.body.id);
  if (!entry) {
    res.data = { err: 'Entry with this id does not exist' };
    return next();
  }
  entry.citationKey = req.body.citationKey || entry.citationKey;
  if (req.body.entryTags) {
    Object.assign(entry.entryTags, req.body.entryTags);
    entry.markModified('entryTags');
  }
  try {
    const newEntry = await entry.save();
    res.data = newEntry;
    return next();
  } catch (err) {
    res.data = { err: err.message };
    return next();
  }
});

// @route POST api/database/entry
// @desc Create database entry
router.post('/entry', auth, async (req, res, next) => {
  if (!req.body.id) {
    res.data = { err: 'Database id missing' };
    return next();
  }
  if (!req.body.entry) {
    res.data = { err: 'Entry missing' };
    return next();
  }
  const database = await Database.findById(req.body.id);
  if (!database) {
    res.data = { err: 'Database with this id does not exist' };
    return next();
  }
  try {
    const newEntry = new Entry({
      ...req.body.entry,
      user: req.user.id,
    });
    const entry = await newEntry.save();
    database.entries.push(entry._id);
    await database.save();
    res.data = entry;
    return next();
  } catch (err) {
    console.log(err);
    res.data = { err: err.message };
    return next();
  }
});

// @route DELETE api/database/entry
// @desc Delete database entry
router.delete('/entry', auth, async (req, res, next) => {
  if (!req.body.databaseId) {
    res.data = { err: 'Database id missing' };
    return next();
  }
  if (!req.body.entryId) {
    res.data = { err: 'Entry id missing' };
    return next();
  }
  const database = await Database.findById(req.body.databaseId);
  if (!database) {
    res.data = { err: 'Database with this id does not exist' };
    return next();
  }
  const entry = await Entry.findById(req.body.entryId);
  if (!entry) {
    res.data = { err: 'Entry with this id does not exist' };
    return next();
  }
  if (entry.user.toString() !== req.user.id) {
    res.data = { err: 'Entry does not belong to this user', status: 401 };
    return next();
  }
  if (!database.entries.map((id) => id.toString()).includes(req.body.entryId)) {
    res.data = { err: 'Entry with this id is not presented in a database' };
    return next();
  }
  try {
    database.entries = database.entries.filter(
      (id) => id.toString() !== req.body.entryId
    );
    await database.save();
    const removedEntry = await entry.remove();
    res.data = removedEntry;
    return next();
  } catch (err) {
    res.data = { err: err.message };
    return next();
  }
});

// @route api/database/upload
// @desc Upload new entries of a database or add new one
router.post('/upload', auth, async (req, res, next) => {
  if (!req.body.bibtexdatabasename) {
    res.data = { err: 'Bibtexdatabasename missing' };
    return next();
  }
  if (!req.body.entries || !Array.isArray(req.body.entries)) {
    res.data = { err: 'Entries missing or invalid' };
    return next();
  }
  const database = await Database.findOne({
    bibtexdatabasename: req.body.bibtexdatabasename,
  }).populate('entries');
  try {
    if (!database) {
      const newDatabase = new Database({
        ...req.body,
        user: req.user.id,
      });
      newDatabase.save();
      res.data = newDatabase;
      return next();
    } else {
      let contains;
      let promises = [];
      for (let entry of req.body.entries) {
        contains = false;
        for (let entryDB of database.entries) {
          if (entryDB.citationKey === entry.citationKey) {
            contains = true;
            Object.assign(entryDB.entryTags, entry.entryTags);
            entryDB.markModified('entryTags');
            promises.push(entryDB.save());
          }
        }
        if (!contains) {
          let newEntry = new Entry({
            ...entry,
            user: req.user.id,
          });
          newEntry = await newEntry.save();
          database.entries.push(newEntry);
        }
      }
      if (promises.length !== 0) await Promise.all(promises);
      await database.save();
      res.data = database;
      return next();
    }
  } catch (err) {
    res.data = { err: err.message };
    console.log(err);
    return next();
  }
});

module.exports = router;
