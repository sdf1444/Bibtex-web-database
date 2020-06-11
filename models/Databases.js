const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DatabasesSchema = new Schema({
  bibtexdatabasename: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  article: [
    {
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
        type: Date,
        required: true,
      },
      volume: {
        type: Number,
      },
      number: {
        type: Number,
      },
      pages: {
        type: Number,
      },
      month: {
        type: String,
      },
    },
  ],
  book: [
    {
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
        type: Date,
        required: true,
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
        type: Date,
      },
      year: {
        type: Number,
      },
    },
  ],
  conference: [
    {
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
        type: Number,
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
        type: Number,
        required: true,
      },
      publisher: {
        type: String,
        required: true,
      },
      year: {
        type: Number,
        required: true,
      },
      volume: {
        type: Number,
      },
      series: {
        type: Number,
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
        type: Number,
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
      type: {
        type: String,
      },
      chapter: {
        type: Number,
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
      publisher: {
        type: String,
      },
      month: {
        type: Number,
      },
    },
  ],
  inProceedings: [
    {
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
        type: Number,
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
        type: Number,
      },
    },
  ],
  mastersThesis: [
    {
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
        type: Number,
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
        type: Number,
      },
    },
  ],
  online: [
    {
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
        type: Number,
      },
      url: {
        type: String,
      },
    },
  ],
  phdThesis: [
    {
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
        type: Number,
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
      key: {
        type: String,
      },
      title: {
        type: String,
        required: true,
      },
      year: {
        type: Number,
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

module.exports = Databases = mongoose.model('databases', DatabasesSchema);
