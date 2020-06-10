const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OnlineSchema = new Schema({
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
  month: {
    type: Date,
  },
  year: {
    type: Date,
  },
  url: {
    type: String,
  },
});

module.exports = Online = mongoose.model('online', OnlineSchema);
