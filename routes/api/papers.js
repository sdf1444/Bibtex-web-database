const express = require('express');
const multer = require('multer');
const router = require('./database');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${+new Date()}.pdf`);
  },
});

const upload = multer({
  storage,
});

const Paper = require('../../models/Paper');

router.get('/', async (req, res, next) => {
  try {
    const paper = await Paper.find().populate('paper');
    res.json(paper);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/add', upload.single('paper'), async (req, res, next) => {
  try {
    const path = req.file.path;
    const { paper, doi } = req.body;
    const entry = await Paper.create({
      paper,
      doi,
      pdf: path,
    });
    res.json(entry);
  } catch (ex) {
    res.status(400).send({ error: ex });
  }
});

router.put('/edit', upload.single('pdf'), async (req, res, next) => {
  try {
    const path = req.file && req.file.path;
    const { id, paper, doi } = req.body;
    let params = {};
    if (path) {
      params = {
        paper,
        doi,
        pdf: path,
      };
    } else {
      params = {
        paper,
        doi,
      };
    }
    const paper = await Paper.findOneAndUpdate(params, {
      where: {
        id,
      },
    });
    res.json(paper);
  } catch (ex) {
    res.status(400).send({ error: ex });
  }
});

router.delete('/delete/:id', async (req, res, next) => {
  Paper.findByIdAndDelete(req.params.id).then((result) => {
    res.json({ deleted: id });
  });
});

module.exports = router;
