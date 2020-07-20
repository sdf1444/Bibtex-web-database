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
  article: ['number', 'pages', 'volume'],
  book: ['series', 'address', 'edition', 'volume'],
  booklet: ['howpublished', 'address'],
  conference: [
    'editor',
    'volume',
    'series',
    'pages',
    'address',
    'organisation',
    'publisher',
  ],
  inBook: ['volume', 'series', 'type', 'address', 'edition'],
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
  ],
  inProceedings: [
    'editor',
    'volume',
    'series',
    'pages',
    'address',
    'organization',
    'publisher',
  ],
  manual: ['organization', 'address', 'edititon'],
  mastersThesis: ['school', 'type', 'address'],
  misc: ['howpublished'],
  online: ['url'],
  phdThesis: ['type', 'address'],
  proceedings: [
    'editor',
    'volume',
    'series',
    'address',
    'publisher',
    'organization',
  ],
};

for (let [key, value] of Object.entries(requiredEntryFields)) {
  requiredEntryFields[key].push('author');
  requiredEntryFields[key].push('title');
  requiredEntryFields[key].push('year');
}

for (let key of Object.keys(extraEntryFields)) {
  extraEntryFields[key].push('month');
}
const entryFields = {};
Object.keys(requiredEntryFields).forEach((key) => {
  entryFields[key] = {
    required: requiredEntryFields[key],
    extra: extraEntryFields[key],
  };
});

const onBibtexClick = (info) => {
  const entryType = info.menuItemId.split('-')[1];
  const sep = info.menuItemId.split('-')[2];
  const string = info.selectionText;
  chrome.storage.local.set({ entry: { entryType, string, sep } });
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        functiontoInvoke: 'showNotification',
      });
      console.log('sending message');
      console.log(tabs[0]);
    }
  );
};

const getDatabases = async () => {
  const res = await fetch('http://localhost:5000/api/database', {
    method: 'GET',
  }).then((res) => res.json());
  console.log(res);
  chrome.storage.local.set({ databases: res.response });
  console.log('updated databases');
};

chrome.contextMenus.create({
  id: 'parseBibtex',
  title: 'Add Bibtex reference',
  contexts: ['selection'],
});

for (let entryType of Object.keys(entryFields)) {
  chrome.contextMenus.create({
    id: `bibtex-${entryType}`,
    title: entryType[0].toUpperCase() + entryType.slice(1),
    parentId: 'parseBibtex',
    contexts: ['selection'],
  });
  for (let sep of [',', '.', ';', ':']) {
    chrome.contextMenus.create({
      id: `bibtex-${entryType}-${sep}`,
      title: `Separator: "${sep}"`,
      parentId: `bibtex-${entryType}`,
      contexts: ['selection'],
      onclick: onBibtexClick,
    });
  }
}

getDatabases();