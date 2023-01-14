const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const { mongo, connection } = require('mongoose');
const Grid = require('gridfs-stream');
const Paper = require('../models/Paper');
const mongoose = require('mongoose');
Grid.mongo = mongo;

let gridFS;

// Save the grid file stream to the gridFS variable
connection.once('open', function saveGridFS() {
  gridFS = Grid(connection.db);
});

// set up connection to db for file storage
const storage = require('multer-gridfs-storage')({
  db: connection,
  file: (req, file) => {
    return {
      filename: file.originalname,
    };
  },
});

// sets file input to single file
const singleUpload = multer({ storage: storage }).single('file');

// @route GET api/papers/files/:id
// @desc Get file by id.
router.get('/files/:id', async (req, res, next) => {
  gridFS.files
    .find({ _id: mongoose.Types.ObjectId(req.params.id) })
    .toArray((err, files) => {
      console.log(files);
      if (!files || files.length === 0) {
        res.data = { err: 'File with this name does not exist' };
        return next();
      }
      var readstream = gridFS.createReadStream({
        filename: files[0].filename,
      });
      res.set('Content-Type', files[0].contentType);
      return readstream.pipe(res);
    });
});

// @route GET api/papers/files
// @desc Get files for this user
router.get('/files', auth, async (req, res, next) => {
  const papers = await Paper.find({ user: req.user.id });
  console.log(papers);
  gridFS.files.find().toArray((err, files) => {
    if (!files) {
      res.data = [];
      return next();
    }
    res.data = papers.map((paper) => {
      const file = files.find(
        (file) => file._id.toString() === paper.file.toString()
      );
      return {
        ...paper.toObject(),
        file,
      };
    });
    console.log(res.data);
    return next();
  });
});

// @route POST api/papers/files
// @desc Create new file
router.post('/files', auth, singleUpload, async (req, res, next) => {
  if (!req.file) {
    res.data = { err: 'File missing' };
    return next();
  }
  const paper = new Paper({
    user: req.user.id,
    filename: req.file.filename,
    file: mongoose.Types.ObjectId(req.file.id),
  });
  await paper.save();
  res.data = req.file;
  return next();
});

// @route DELETE api/papers/files/:id
// @desc Delete File and Paper by file id
router.delete('/files/:id', auth, async (req, res, next) => {
  const paper = await Paper.findOne({ user: req.user.id, file: req.params.id });
  if (!paper) {
    res.data = { err: 'Paper with this id does not exist' };
    return next();
  }
  const removedPaper = await paper.remove();
  gridFS.remove({ _id: removedPaper.file }, (err) => {
    if (err) {
      res.data = { err: err.message };
      return next();
    }
    res.data = { removedPaper };
    return next();
  });
});

module.exports = router;
