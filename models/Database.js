const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DatabaseSchema = new Schema({
  bibtexdatabasename: {
    type: String,
    unique: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  article: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      key: {
        type: String,
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
        type: String,
        required: true,
      },
      volume: {
        type: String,
      },
      number: {
        type: String,
      },
      pages: {
        type: String,
      },
      month: {
        type: String,
      },
    },
  ],
  book: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      key: {
        type: String,
      },
      author: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      publisher: {
        type: String,
        required: true,
      },
      year: {
        type: String,
        required: true,
      },
      volume: {
        type: String,
      },
      series: {
        type: String,
      },
      address: {
        type: String,
      },
      edition: {
        type: String,
      },
      month: {
        type: String,
      },
    },
  ],
  booklet: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      key: {
        type: String,
      },
      title: {
        type: String,
      },
      author: {
        type: String,
      },
      howpublished: {
        type: String,
      },
      address: {
        type: String,
      },
      month: {
        type: String,
      },
      year: {
        type: String,
      },
    },
  ],
  conference: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      key: {
        type: String,
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
        type: String,
        required: true,
      },
      editor: {
        type: String,
      },
      volume: {
        type: String,
      },
      series: {
        type: String,
      },
      pages: {
        type: String,
      },
      address: {
        type: String,
      },
      month: {
        type: String,
      },
      organization: {
        type: String,
      },
      publisher: {
        type: String,
      },
    },
  ],
  inBook: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      key: {
        type: String,
      },
      author: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      chapter: {
        type: String,
        required: true,
      },
      publisher: {
        type: String,
        required: true,
      },
      year: {
        type: String,
        required: true,
      },
      volume: {
        type: String,
      },
      series: {
        type: String,
      },
      type: {
        type: String,
      },
      address: {
        type: String,
      },
      edition: {
        type: String,
      },
      month: {
        type: String,
      },
    },
  ],
  inCollection: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      key: {
        type: String,
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
      publisher: {
        type: String,
        required: true,
      },
      year: {
        type: String,
        required: true,
      },
      editor: {
        type: String,
      },
      volume: {
        type: String,
      },
      series: {
        type: String,
      },
      type: {
        type: String,
      },
      chapter: {
        type: String,
      },
      pages: {
        type: String,
      },
      address: {
        type: String,
      },
      edition: {
        type: String,
      },
      organization: {
        type: String,
      },
      month: {
        type: String,
      },
    },
  ],
  inProceedings: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      key: {
        type: String,
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
        type: String,
        required: true,
      },
      editor: {
        type: String,
      },
      volume: {
        type: String,
      },
      series: {
        type: String,
      },
      pages: {
        type: String,
      },
      address: {
        type: String,
      },
      month: {
        type: String,
      },
      organization: {
        type: String,
      },
      publisher: {
        type: String,
      },
    },
  ],
  manual: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      key: {
        type: String,
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
        type: String,
      },
      year: {
        type: String,
      },
    },
  ],
  mastersThesis: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      key: {
        type: String,
      },
      author: {
        type: String,
      },
      title: {
        type: String,
      },
      school: {
        type: String,
      },
      year: {
        type: String,
      },
      type: {
        type: String,
      },
      address: {
        type: String,
      },
      month: {
        type: String,
      },
    },
  ],
  misc: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      key: {
        type: String,
      },
      author: {
        type: String,
      },
      title: {
        type: String,
      },
      howpublished: {
        type: String,
      },
      month: {
        type: String,
      },
      year: {
        type: String,
      },
    },
  ],
  online: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      key: {
        type: String,
      },
      author: {
        type: String,
      },
      title: {
        type: String,
      },
      month: {
        type: String,
      },
      year: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  ],
  phdThesis: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      key: {
        type: String,
      },
      author: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      school: {
        type: String,
        required: true,
      },
      year: {
        type: String,
        required: true,
      },
      type: {
        type: String,
      },
      address: {
        type: String,
      },
      month: {
        type: String,
      },
    },
  ],
  proceedings: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      key: {
        type: String,
      },
      title: {
        type: String,
        required: true,
      },
      year: {
        type: String,
        required: true,
      },
      editor: {
        type: String,
      },
      volume: {
        type: String,
      },
      series: {
        type: String,
      },
      address: {
        type: String,
      },
      month: {
        type: String,
      },
      publisher: {
        type: String,
      },
      organization: {
        type: String,
      },
    },
  ],
});

module.exports = Database = mongoose.model('database', DatabaseSchema);
