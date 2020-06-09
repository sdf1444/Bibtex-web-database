const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
  documentname: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  article: {
    type: Schema.Types.ObjectId,
    ref: 'article',
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: 'book',
  },
  booklet: {
    type: Schema.Types.ObjectId,
    ref: 'booklet',
  },
  conference: {
    type: Schema.Types.ObjectId,
    ref: 'conference',
  },
  inbook: {
    type: Schema.Types.ObjectId,
    ref: 'inBook',
  },
  inCollection: {
    type: Schema.Types.ObjectId,
    ref: 'inCollection',
  },
  inProceedings: {
    type: Schema.Types.ObjectId,
    ref: 'inProceedings',
  },
  manual: {
    type: Schema.Types.ObjectId,
    ref: 'manual',
  },
  mastersThesis: {
    type: Schema.Types.ObjectId,
    ref: 'mastersThesis',
  },
  misc: {
    type: Schema.Types.ObjectId,
    ref: 'misc',
  },
  online: {
    type: Schema.Types.ObjectId,
    ref: 'online',
  },
  phdThesis: {
    type: Schema.Types.ObjectId,
    ref: 'phdThesis',
  },
  proceedings: {
    type: Schema.Types.ObjectId,
    ref: 'proceedings',
  },
});

module.exports = Document = mongoose.model('document', DocumentSchema);
