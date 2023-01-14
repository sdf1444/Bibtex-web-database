const requiredEntryFields = {
    article: ['author', 'journal'],
    book: ['author', 'publisher'],
    booklet: ['author'],
    conference: ['author', 'booktitle'],
    inBook: ['author', 'chapter', 'publisher'],
    inCollection: ['author', 'booktitle', 'publisher'],
    inProceedings: ['author', 'booktitle'],
    manual: ['author'],
    mastersThesis: ['author'],
    misc: ['author'],
    online: ['author'],
    phdThesis: ['author', 'school'],
    proceedings: ['author'],
}

const extraEntryFields = {
    article: ['number', 'pages', 'volume'],
    book: ['series', 'address', 'edition', 'volume'],
    booklet: ['howpublished', 'address'],
    conference: ['editor', 'volume', 'series', 'pages', 'address', 'organisation', 'publisher'],
    inBook: ['volime', 'series', 'type', 'address', 'edition'],
    inCollection: ['editor', 'volume', 'series', 'type', 'address', 
    'chapter', 'pages', 'edition', 'organization'],
    inProceedings: ['editor', 'volume', 'series', 'pages', 'address', 'organization', 'publisher'],
    manual: ['organization', 'address', 'edititon'],
    mastersThesis: ['school', 'type', 'address'],
    misc: ['howpublished'],
    online: ['url'],
    phdThesis: ['type', 'address'],
    proceedings: ['editor', 'volume', 'series', 'address', 'publisher', 'organization']
}

for (let [key, value] of Object.entries(requiredEntryFields)) {
    requiredEntryFields[key].push('title');
    requiredEntryFields[key].push('year');
}

for (let key of Object.keys(extraEntryFields)) {
    extraEntryFields[key].push('month');
}
const entryFields = {};
Object.keys(requiredEntryFields).forEach(key => {
    entryFields[key] = {
        required: requiredEntryFields[key],
        extra: extraEntryFields[key]
    }
})

module.exports = entryFields;