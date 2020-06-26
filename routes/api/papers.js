const express = require('express');
const router = express.Router();

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

module.exports = router;
