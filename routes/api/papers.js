const express = require('express');
const router = express.Router();
const multer = require('multer');
const { mongo, connection } = require('mongoose');
const Grid = require('gridfs-stream');
Grid.mongo = mongo;

let gridFS;

const Paper = require('../../models/Paper');

//@route  POST api/papers
//@desc   Add pdf file
//@access Public
router.post('/', async (req, res) => {
  let newPaper = new Paper({
    paper: req.body.paper,
    doi: req.body.doi,
    pdf: req.body.pdf,
  });

  newPaper.save().then((result) => {
    res.json({
      success: `Successfully added!`,
    });
  });
});

//@route   GET api/papers
//@desc    Get paper
//@access  Public
router.get('/', async (req, res) => {
  Paper.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

//@route   GET api/papers/:id
//@desc    Get single paper
//@access  Public
router.get('/:id', async (req, res) => {
  Paper.findById(req.params.id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  });
});

// Update paper
router.put('/:id', (req, res) => {
  Paper.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (error, data) => {
      if (error) {
        return next(error);
        console.log(error);
      } else {
        res.json(data);
        console.log('Paper updated successfully!');
      }
    }
  );
});

//@route   DELETE api/papers/:id
//@desc    Delete paper pdf file
//@access  Public
router.delete('/:id', (req, res) => {
  Paper.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.json({
        success: true,
        msg: `It has been deleted.`,
        result: {
          _id: result._id,
          paper: result.paper,
          doi: result.doi,
          pdf: result.pdf,
        },
      });
    })
    .catch((err) => {
      res.status(404).json({ success: false, msg: 'Nothing to delete.' });
    });
});

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

router.get('/files', (req, res) => {
  gridFS.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        message: 'Could not find files',
      });
    }
    return res.json(files);
  });
});

router.post('/files', singleUpload, (req, res) => {
  if (req.file) {
    return res.json({
      success: true,
      file: req.file,
    });
  }
  res.send({ success: false });
});

router.delete('/files/:id', (req, res) => {
  gridFS.remove({ _id: req.params.id }, (err) => {
    if (err) return res.status(500).json({ success: false });
    return res.json({ success: true });
  });
});

module.exports = router;
