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
  article: ['number', 'pages', 'volume', 'month', 'doi', 'annotation'],
  book: [
    'series',
    'address',
    'edition',
    'volume',
    'month',
    'doi',
    'annotation',
  ],
  booklet: ['howpublished', 'address', 'month', 'doi', 'annotation'],
  conference: [
    'editor',
    'volume',
    'series',
    'pages',
    'address',
    'organisation',
    'publisher',
    'month',
    'doi',
    'annotation',
  ],
  inBook: [
    'volime',
    'series',
    'type',
    'address',
    'edition',
    'month',
    'doi',
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
    'doi',
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
    'doi',
    'annotation',
  ],
  manual: ['organization', 'address', 'edititon', 'month', 'doi', 'annotation'],
  mastersThesis: ['school', 'type', 'address', 'month', 'doi', 'annotation'],
  misc: ['howpublished', 'month', 'doi', 'annotation'],
  online: ['url', 'month', 'annotation'],
  phdThesis: ['type', 'address', 'month', 'doi', 'annotation'],
  proceedings: [
    'editor',
    'volume',
    'series',
    'address',
    'publisher',
    'organization',
    'month',
    'doi',
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
