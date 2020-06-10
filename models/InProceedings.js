const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InProceedingsSchema = new Schema({
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
    type: String,
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

module.exports = InProceedings = mongoose.model(
  'inProceedings',
  InProceedingsSchema
);
