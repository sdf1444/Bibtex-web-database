const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ManualSchema = new Schema({
  key: {
    type: String,
  },
  document: {
    type: Schema.Types.ObjectId,
  },
  user: {
    type: Schema.Types.ObjectId,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
  },
  organization: {
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
  year: {
    type: Date,
  },
});

module.exports = Manual = mongoose.model('manual', ManualSchema);
