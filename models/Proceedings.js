const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProceedingsSchema = new Schema({
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
  address: {
    type: String,
  },
  month: {
    type: Date,
  },
  publisher: {
    type: String,
  },
  organization: {
    type: String,
  },
});

module.exports = Proceedings = mongoose.model('proceedings', ProceedingsSchema);
