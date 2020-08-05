const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const paperSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  file: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = Paper = mongoose.model('paper', paperSchema);
