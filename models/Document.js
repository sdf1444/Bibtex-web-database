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
});

module.exports = Document = mongoose.model('document', DocumentSchema);
