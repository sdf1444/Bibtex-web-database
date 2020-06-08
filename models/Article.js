const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
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
  journal: {
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
  number: {
    type: Number,
  },
  pages: {
    type: Number,
  },
  month: {
    type: Date,
  },
});

module.exports = Article = mongoose.model('article', ArticleSchema);
