const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookletSchema = new Schema({
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
  title: {
    type: String,
  },
  author: {
    type: String,
  },
  howpublished: {
    type: String,
  },
  address: {
    type: String,
  },
  month: {
    type: Date,
  },
  year: {
    type: Date,
  },
});

module.exports = Booklet = mongoose.model('booklet', BookletSchema);
