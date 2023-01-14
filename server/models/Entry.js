const mongoose = require('mongoose');
const entryFields = require('./entryFields');

const Schema = mongoose.Schema;

const entrySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
  },
  entryType: {
    type: String,
    required: true,
  },
  citationKey: {
    type: String,
    required: true,
  },
  entryTags: {
    type: Object,
    required: true,
  },
});

entrySchema.pre('validate', function (next) {
  if (!Object.keys(entryFields).includes(this.entryType)) {
    return next(new Error(`Entry Type '${this.entryType}' is not supported`));
  }
  const allTags = entryFields[this.entryType];
  if (typeof this.entryTags !== 'object') {
    return next(new Error(`Entry tags '${this.entryTags}' is not an Object`));
  }
  for (let tag of Object.keys(this.entryTags)) {
    // check if tags are defined
    if (!allTags.required.includes(tag) && !allTags.extra.includes(tag)) {
      return next(new Error(`Entry Tag '${tag}' is not supported`));
    }
    // check if tags are String
    if (typeof tag !== 'string') {
      return next(new Error(`Entry Tag '${tag}' is not a String`));
    }
  }
  // check if all required tags are implemented in Entry
  for (let tag of allTags.required) {
    if (!Object.keys(this.entryTags).includes(tag)) {
      return next(
        new Error(`Required Entry Tag '${tag}' is not defined in this entry`)
      );
    }
  }
  return next();
});

module.exports = Entry = mongoose.model('entry', entrySchema);
