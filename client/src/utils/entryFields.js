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
    requiredEntryFields[key].push('author');
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