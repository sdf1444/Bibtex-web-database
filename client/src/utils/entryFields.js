const requiredEntryFields = {
  article: ['journal'],
  book: ['publisher'],
  booklet: [],
  conference: ['booktitle'],
  inBook: ['chapter', 'publisher'],
  inCollection: ['booktitle', 'publisher'],
  inProceedings: ['booktitle'],
  manual: [],
  mastersThesis: [],
  misc: [],
  online: [],
  phdThesis: ['school'],
  proceedings: [],
};

const extraEntryFields = {
  article: ['number', 'pages', 'volume', 'month', 'url', 'annotation'],
  book: [
    'series',
    'address',
    'edition',
    'volume',
    'month',
    'url',
    'annotation',
  ],
  booklet: ['howpublished', 'address', 'month', 'url', 'annotation'],
  conference: [
    'editor',
    'volume',
    'series',
    'pages',
    'address',
    'organisation',
    'publisher',
    'month',
    'url',
    'annotation',
  ],
  inBook: [
    'volime',
    'series',
    'type',
    'address',
    'edition',
    'month',
    'url',
    'annotation',
  ],
  inCollection: [
    'editor',
    'volume',
    'series',
    'type',
    'address',
    'chapter',
    'pages',
    'edition',
    'organization',
    'month',
    'url',
    'annotation',
  ],
  inProceedings: [
    'editor',
    'volume',
    'series',
    'pages',
    'address',
    'organization',
    'publisher',
    'month',
    'url',
    'annotation',
  ],
  manual: ['organization', 'address', 'edititon', 'month', 'url', 'annotation'],
  mastersThesis: ['school', 'type', 'address', 'month', 'url', 'annotation'],
  misc: ['howpublished', 'month', 'url', 'annotation'],
  online: ['url'],
  phdThesis: ['type', 'address', 'month', 'url', 'annotation'],
  proceedings: [
    'editor',
    'volume',
    'series',
    'address',
    'publisher',
    'organization',
    'month',
    'url',
    'annotation',
  ],
};

for (let [key, value] of Object.entries(requiredEntryFields)) {
  requiredEntryFields[key].push('author');
  requiredEntryFields[key].push('title');
  requiredEntryFields[key].push('year');
}

const entryFields = {};
Object.keys(requiredEntryFields).forEach((key) => {
  entryFields[key] = {
    required: requiredEntryFields[key],
    extra: extraEntryFields[key],
  };
});

export default entryFields;
