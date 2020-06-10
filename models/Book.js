const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
  key: {
    type: String,
  },
  document: {
    type: Schema.Types.ObjectId,
    ref: 'document',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
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

module.exports = Book = mongoose.model('book', BookSchema);
