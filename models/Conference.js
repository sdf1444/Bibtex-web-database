const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConferenceSchema = new Schema({
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
  booktitle: {
    type: String,
    required: true,
  },
  year: {
    type: Date,
    required: true,
  },
  editor: {
    type: String,
  },
  volume: {
    type: Number,
  },
  series: {
    type: Number,
  },
  pages: {
    type: String,
  },
  address: {
    type: String,
  },
  month: {
    type: Date,
  },
  organization: {
    type: String,
  },
  publisher: {
    type: String,
  },
});

module.exports = Conference = mongoose.model('conference', ConferenceSchema);
