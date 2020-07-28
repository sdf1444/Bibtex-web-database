const express = require('express');
const auth = require('../middleware/auth');
const Database = require('../models/Database');
const Entry = require('../models/Entry');
const User = require('../models/User');
const { updateEntry } = require('../services/entry');
const { param } = require('express-validator');
const Group = require('../models/Group');

const router = express.Router();

// @route GET api/database/me
// @desc Get databases that user has access to
router.get('/me', auth, async (req, res, next) => {
    const databases = (await Database.find({}).sort({ updatedAt: -1 }).populate('entries')
    .populate('entries').populate('group').exec()).filter(database => {
        return (database.user && database.user._id.toString() === req.user.id.toString())
        || (database.group && database.group.owner.toString() === req.user.id.toString())
        || (database.group && database.group.users.map(user => user.toString())
        .includes(req.user.id.toString()));
    })
    res.data = databases;
    return next();
})

// @route GET api/database
// @desc Get all databases
router.get('/', async (req, res, next) => {
    const databases = await Database.find({}).sort({ updatedAt: -1 }).populate('entries')
    .populate('entries').populate('group').exec();
    res.data = databases;
    return next();
})

// @route GET api/database/all
// @desc Get all databases, but first those who belong to this user
router.get('/all', auth, async (req, res, next) => {
    const databases = await Database.find({}).sort({ updatedAt: -1 }).populate('entries')
    .populate('user').populate('group').exec();
    const sortedDatabases = databases.sort((A, B) => {
        const a = (A.user && A.user._id.toString() === req.user.id) ||
        (A.group && (A.group.owner.toString() === req.user.id || 
        A.group.users.map(user => user._id.toString())
        .includes(req.user.id)));
        const b = (B.user && B.user._id.toString() === req.user.id) ||
        (B.group && (B.group.owner.toString() === req.user.id || 
        B.group.users.map(user => user._id.toString())
        .includes(req.user.id)));
        if (a && b) return new Date(b.updatedAt) - new Date(a.updatedAt);
        else if (a) return -1;
        else return 1;
    });
    res.data = sortedDatabases.filter(database => {
        return (database.user && database.user._id.toString() === req.user.id.toString())
        || (database.group && database.group.owner.toString() === req.user.id.toString())
        || (database.group && database.group.users.map(user => user.toString())
        .includes(req.user.id.toString()));
    });
    return next();
})

// @route GET api/database/entries
// @desc Get all entries
router.get('/entries', async (req, res, next) => {
    const entries = await Entry.find({});
    res.data = entries;
    return next();
})

// @route POST api/database
// @desc Create empty database with no entries
router.post('/', auth, async (req, res, next) => {
    params = {};
    console.log(req.body)
    if (req.body.group) {
        params.group = req.body.group;
        const group = await Group.findById(req.body.group);
        if (!group) {
            res.data = { err: 'Group with this id does not exist' }
            return next();
        }
        if (group.owner.toString() !== req.user.id.toString()
        && !group.users.map(user => user.toString()).includes(req.user.id.toString())) {
            res.data = { err: 'This is not your group' }
            return next();
        }
    }
    else {
        params.user = req.user.id;
    }
    try {
        const newDatabase = new Database({
            bibtexdatabasename: req.body.bibtexdatabasename,
            ...params,
        })
        const database = await newDatabase.save();
        res.data = await database.populate('entries').populate('user').populate('group')
        .execPopulate();
        return next();
    } catch (err) {
        console.log(err.message);
        res.data = { err: err.message }
        return next();
    }
})

// @route PUT api/database/
// @desc Change database name
router.put('/', auth, async (req, res, next) => {
    try {
        if (!req.body.bibtexdatabasename || req.body.bibtexdatabasename === '') {
            res.data = { err: 'Database name missing or invalid' }
            return next();
        }
        const database = await Database.findById(req.body.id);
        if (!database) {
            res.data = { err: 'Database with this id does not exist' }
            return next();
        }
        database.bibtexdatabasename = req.body.bibtexdatabasename;
        const newDatabase = await database.save();
        res.data = await newDatabase.populate('entries').populate('user').populate('group')
        .execPopulate();
        return next();
    } catch (err) {
        console.log(err.message);
        res.data = { err: err.message }
        return next();
    }
})

// @route DELETE api/database
// @desc Delete database
router.delete('/:id', auth, async (req, res, next) => {
    if (!req.params.id) {
        res.data = { err: 'Database id missing' }
        return next();
    }
    const database = await Database.findById(req.params.id).populate('group');
    if (!database) {
        res.data = { err: 'Database with this id does not exist' }
        return next();
    }
    if (!((database.user && database.user.toString() === req.user.id) ||
    (database.group && database.group.owner.toString() === req.user.id) ||
    (database.group && database.group.users.map(user => user.toString())
    .includes(req.user.id.toString())))) {
        res.data = { err: 'Database does not belong to this user', status: 401 }
        return next();
    }
    await Promise.all(database.entries.map(entry => Entry.findByIdAndRemove(entry).exec()));
    await database.remove();
    res.data = database;
    return next();
})

// @route PUT api/database/entry
// @desc Update database entry
router.put('/entry', auth, async (req, res, next) => {
    if (!req.body.databaseId) {
        res.data = { err: 'Database id missing' }
        return next();
    }
    if (!req.body.entryId) {
        res.data = { err: 'Entry id missing' }
    }
    if (!req.body.citationKey && !req.body.entryTags) {
        res.data = { err: 'Citation Key or Entry Tags missing' }
        return next();
    }
    const entry = await Entry.findById(req.body.entryId);
    if (!entry) {
        res.data = { err: 'Entry with this id does not exist' }
        return next();
    }
    const database = await Database.findById(req.body.databaseId).populate('group').exec();
    if (!database) {
        res.data = { err: 'Database with this id does not exist' }
        return next();
    }
    if (!((database.user && database.user.toString() === req.user.id) ||
    (database.group && database.group.owner.toString() === req.user.id) ||
    (database.group && database.group.users.map(user => user.toString())
    .includes(req.user.id.toString())))) {
        res.data = { err: 'Database does not belong to this user', status: 401 }
        return next();
    }
    entry.citationKey = req.body.citationKey || entry.citationKey;
    if (req.body.entryTags) {
        Object.assign(entry.entryTags, req.body.entryTags)
        entry.markModified('entryTags');
    }
    try {
        const newEntry = await entry.save();
        database.updatedAt = new Date();
        await database.save();
        res.data = newEntry;
        return next();
    } catch (err) {
        console.log(err);
        res.data = { err: err.message }
        return next();
    }
})

// @route POST api/database/entry
// @desc Create database entry
router.post('/entry', auth, async (req, res, next) => {
    if (!req.body.id) {
        res.data = { err: 'Database id missing' }
        return next();
    }
    if (!req.body.entry) {
        res.data = { err: 'Entry missing' }
        return next();
    }
    const database = await Database.findById(req.body.id).populate('group').exec();
    if (!database) {
        res.data = { err: 'Database with this id does not exist' }
        return next();
    }
    if (!((database.user && database.user.toString() === req.user.id) ||
    (database.group && database.group.owner.toString() === req.user.id) ||
    (database.group && database.group.users.map(user => user.toString())
    .includes(req.user.id.toString())))) {
        res.data = { err: 'Database does not belong to this user', status: 401 }
        return next();
    }
    try {
        const newEntry = new Entry({
            ...req.body.entry,
            user: req.user.id
        });
        const entry = await newEntry.save();
        database.entries.push(entry._id);
        await database.save();
        res.data = entry;
        return next();
    } catch (err) {
        console.log(err);
        res.data = { err: err.message }
        return next();
    }
})

// @route DELETE api/database/entry
// @desc Delete database entry
router.delete('/entry/:databaseId/:entryId', auth, async (req, res, next) => {
    if (!req.params.databaseId) {
        res.data = { err: 'Database id missing' }
        return next();
    }
    if (!req.params.entryId) {
        res.data = { err: 'Entry id missing' }
        return next();
    }
    const database = await Database.findById(req.params.databaseId).populate('group').exec();
    if (!database) {
        res.data = { err: 'Database with this id does not exist' }
        return next();
    }
    if (!((database.user && database.user.toString() === req.user.id) ||
    (database.group && database.group.owner.toString() === req.user.id) ||
    (database.group && database.group.users.map(user => user.toString())
    .includes(req.user.id.toString())))) {
        res.data = { err: 'Database does not belong to this user', status: 401 }
        return next();
    }
    const entry = await Entry.findById(req.params.entryId);
    if (!entry) {
        res.data = { err: 'Entry with this id does not exist' }
        return next();
    }
    if (entry.user && entry.user.toString() !== req.user.id) {
        res.data = { err: 'Entry does not belong to this user', status: 401 }
        return next();
    }
    if (!database.entries.map(id => id.toString()).includes(req.params.entryId)) {
        res.data = { err: 'Entry with this id is not presented in a database' }
        return next();
    }
    try {
        database.entries = database.entries.filter(id => id.toString() !== req.params.entryId);
        await database.save();
        const removedEntry = await entry.remove();
        res.data = removedEntry;
        return next();
    } catch (err) {
        res.data = { err: err.message }
        return next();
    }
})

// @route api/database/upload
// @desc Upload new entries of a database or add new one
router.post('/upload', auth, async (req, res, next) => {
    if (!req.body.bibtexdatabasename) {
        res.data = { err: 'Bibtexdatabasename missing' }
        return next();
    }
    if (!req.body.entries || !Array.isArray(req.body.entries)) {
        res.data = { err: 'Entries missing or invalid' }
        return next();
    }
    const database = await Database.findOne({ 
        bibtexdatabasename: req.body.bibtexdatabasename 
    }).populate('entries').populate('group');
    try {
        if (!database) {
            const params = {};
            if (req.body.group) {
                params.group = req.body.group;
                const group = await Group.findById(req.body.group);
                if (!group) {
                    res.data = { err: 'Group with this id does not exist' }
                    return next();
                }
                if (group.owner.toString() !== req.user.id.toString()
                && !group.users.map(user => user.toString()).includes(req.user.id.toString())) {
                    res.data = { err: 'This is not your group' }
                    return next();
                }
            }
            else {
                params.user = req.user.id;
            }
            const promises = req.body.entries.map(entry => {
                console.log(entry)
                const newEntry = new Entry({...entry, user: req.user.id });
                return newEntry.save();
            })
            const entries = (await Promise.all(promises)).map(entry => entry._id);
            const newDatabase = new Database({
                bibtexdatabasename: req.body.bibtexdatabasename, 
                ...params,
                entries,
            });
            await newDatabase.save();
            res.data = await newDatabase.populate('entries').populate('user').populate('group')
            .execPopulate();;
            return next();
        }
        else {
            if (!((database.user && database.user.toString() === req.user.id) ||
            (database.group && database.group.owner.toString() === req.user.id) ||
            (database.group && database.group.users.map(user => user.toString())
            .includes(req.user.id.toString())))) {
                res.data = { err: 'Database does not belong to this user', status: 401 }
                return next();
            }
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
                        user: req.user.id
                    });
                    newEntry = await newEntry.save();
                    database.entries.push(newEntry);
                }
            }
            try {
                if (promises.length !== 0) await Promise.all(promises);
            } catch (err) {
                console.log(err.message);
            }
            await database.save();
            res.data = await database.populate('entries').populate('user').populate('group')
            .execPopulate();
            return next();
        }
    } catch (err) {
        res.data = { err: err.message }
        console.log(err);
        return next();
    }
})

module.exports = router;
