const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MiscSchema = new Schema({
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
  },
  title: {
    type: String,
  },
  howpublished: {
    type: String,
  },
  month: {
    type: Date,
  },
  year: {
    type: Date,
  },
});

module.exports = Misc = mongoose.model('misc', MiscSchema);
