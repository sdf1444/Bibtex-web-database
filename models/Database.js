const mongoose = require('mongoose');
const Entry = require('./Entry');

const Schema = mongoose.Schema;

const databaseSchema = new Schema(
  {
    bibtexdatabasename: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    entries: [
      {
        type: Schema.Types.ObjectId,
        ref: 'entry',
      },
    ],
  },
  { timestamps: true }
);

databaseSchema.pre('validate', async function (next) {
  const entryKeys = (
    await Promise.all(this.entries.map((entry) => Entry.findById(entry).exec()))
  ).map((entry) => entry.citationKey);
  if (entryKeys.length !== new Set(entryKeys).size) {
    return next(new Error(`Database contains key dublicates`));
  }
  return next();
});

module.exports = Database = mongoose.model('database', databaseSchema);
