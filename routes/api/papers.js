const express = require('express');
const router = require('./database');

const Paper = require('../../models/Paper');

//@route   GET api/papers
//@desc    Get paper
//@access  Public
router.get('/', async (req, res) => {
  try {
    const paper = await Paper.find().populate('paper');
    res.json(paper);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@route  POST api/papers
//@desc   Add pdf file
//@access Public
router.post('/', async (req, res) => {
  let newPaper = new Paper({
    paper: req.body.name,
    doi: req.body.doi,
    pdf: req.body.pdf,
  });

  newPaper.save().then((result) => {
    res.json({
      success: `Successfully added!`,
    });
  });
});

//@route   PUT api/papers/:id
//@desc    Update pdf file
//@access  Public
router.put('/:id', async (req, res) => {
  let updatedPaper = {
    paper: req.body.paper,
    doi: req.body.doi,
    pdf: req.body.pdf,
  };
  Paper.findOneAndUpdate({ _id: req.params.id }, updatedpaper)
    .then((oldResult) => {
      Paper.findOne({ _id: req.params.id })
        .then((newResult) => {
          res.json({
            success: true,
            msg: `Successfully updated!`,
            result: {
              _id: newResult._id,
              paper: newResult.paper,
              doi: newResult.doi,
              pdf: newResult.pdf,
            },
          });
        })
        .catch((err) => {
          res
            .status(500)
            .json({ success: false, msg: `Something went wrong. ${err}` });
          return;
        });
    })
    .catch((err) => {
      if (err.errors) {
        if (err.errors.paper) {
          res
            .status(400)
            .json({ success: false, msg: err.errors.paper.message });
          return;
        }
        if (err.errors.doi) {
          res.status(400).json({ success: false, msg: err.errors.doi.message });
          return;
        }
        if (err.errors.pdf) {
          res.status(400).json({ success: false, msg: err.errors.pdf.message });
          return;
        }
        // Show failed if all else fails for some reasons
        res
          .status(500)
          .json({ success: false, msg: `Something went wrong. ${err}` });
      }
    });
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

module.exports = router;
