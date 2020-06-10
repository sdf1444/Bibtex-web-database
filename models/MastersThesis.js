const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MastersThesisSchema = new Schema({
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
  school: {
    type: String,
  },
  year: {
    type: Date,
  },
  type: {
    type: String,
  },
  address: {
    type: String,
  },
  month: {
    type: Date,
  },
});

module.exports = MastersThesis = mongoose.model(
  'mastersThesis',
  MastersThesisSchema
);
