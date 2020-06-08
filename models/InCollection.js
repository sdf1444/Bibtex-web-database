const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InCollectionSchema = new Schema({
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
  publisher: {
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
    type: String,
  },
  series: {
    type: Number,
  },
  type: {
    type: String,
  },
  chapter: {
    type: Number,
  },
  pages: {
    type: String,
  },
  address: {
    type: String,
  },
  edition: {
    type: String,
  },
  organization: {
    type: String,
  },
  publisher: {
    type: String,
  },
  month: {
    type: Date,
  },
});

module.exports = InCollection = mongoose.model(
  'inCollection',
  InCollectionSchema
);
