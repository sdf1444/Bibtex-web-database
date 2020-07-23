const express = require('express');
const router = express.Router();
const multer = require('multer');
const { mongo, connection } = require('mongoose');
const Grid = require('gridfs-stream');
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

router.get('/files/:filename', (req, res) => {
  gridFS.files.find({ filename: req.params.filename }).toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        message: 'Could not find file',
      });
    }

    var readstream = gridFS.createReadStream({
      filename: files[0].filename,
    });
    res.set('Content-Type', files[0].contentType);
    return readstream.pipe(res);
  });
});

router.get('/files', (req, res, next) => {
  gridFS.files.find().toArray((err, files) => {
    if (!files) {
      res.data = { err: 'Could not find files' };
      return next();
    }
    res.data = files;
    return next();
  });
});

router.post('/files', singleUpload, (req, res, next) => {
  if (!req.file) {
    res.data = { err: 'File missing' };
    return next();
  }
  res.data = req.file;
  return next();
});

router.delete('/files/:id', (req, res, next) => {
  gridFS.remove({ _id: req.params.id }, (err) => {
    if (err) {
      res.data = { err: err.message };
      return next();
    }
    res.data = {};
    return next();
  });
});

module.exports = router;
