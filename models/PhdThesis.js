const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PhdThesisSchema = new Schema({
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
  school: {
    type: String,
    required: true,
  },
  year: {
    type: Date,
    required: true,
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

module.exports = PhdThesis = mongoose.model('phdThesis', PhdThesisSchema);
