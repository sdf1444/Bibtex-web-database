const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaperSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  doi: {
    type: String,
  },
  pdf: {
    type: String,
  },
});

module.exports = Paper = mongoose.model('paper', PaperSchema);
