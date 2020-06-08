const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InBookSchema = new Schema({
  key: {
    type: String,
  },
  document: {
    type: Schema.Types.ObjectId,
  },
  user: {
    type: Schema.Types.ObjectId,
  },
  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  chapter: {
    type: Number,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  year: {
    type: Date,
    required: true,
  },
  volume: {
    type: Number,
  },
  series: {
    type: Number,
  },
  type: {
    type: String,
  },
  address: {
    type: String,
  },
  edition: {
    type: String,
  },
  month: {
    type: Date,
  },
});

module.exports = InBook = mongoose.model('inBook', InBookSchema);
