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

const autoUpdateTime = 2;

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

const getNewEntry = (entryType) => {
    const newEntry = {
        entryType,
        citationKey: '',
        entryTags: {},
    }
    entryFields[entryType].required.forEach(tag => {
        newEntry.entryTags[tag] = '';
    });
    entryFields[entryType].extra.forEach(tag => {
        newEntry.entryTags[tag] = '';
    })
    return newEntry;
}


const onBibtexClick = (info) => {
    const entryType = info.menuItemId.split('-')[1];
    const sep = info.menuItemId.split('-')[2];
    let string = info.selectionText;
    chrome.storage.local.get(['entry'], data => {
        const newEntry = data.entry && data.entry.entryType === entryType ?
        data.entry : {
            entryType,
            citationKey: '',
            entryTags: {},
        }
        // trim
        if (newEntry.entryTags.author && newEntry.entryTags.author !== '' 
        && string.startsWith(newEntry.entryTags.author)) {
            string = string.slice(newEntry.entryTags.author.length);
            if (string.startsWith('.') || string.startsWith(',')
            || string.startsWith(':') || string.startsWith(';')) {
                string = string.slice(1);
                string = string.trim();
            }
        }
        const values = string.split(sep);
        const l = requiredEntryFields[entryType].length - 1;
        newEntry.entryTags.author = newEntry.entryTags.author || '';
        requiredEntryFields[entryType].filter(tag => tag !== 'author').forEach((tag, i) => {
            newEntry.entryTags[tag] = values[i] || '';
        })
        extraEntryFields[entryType].forEach((tag, i) => {
            newEntry.entryTags[tag] = values[i+l] || '';
        })
        console.log('newEntry');
        console.log(newEntry);
        chrome.storage.local.set({ entry: newEntry });
    })
    // SHOW NOTIFICATION
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {
            functiontoInvoke: "showNotification",
            text: 'Entry added to popup page'
        });
        console.log('sending message');
        console.log(tabs[0])
    });
}

const onAuthorClick = (info) => {
    chrome.storage.local.get(['entry'], data => {
        const newEntry = data.entry;
        if (!newEntry) return;
        newEntry.entryTags.author = info.selectionText;
        console.log('newentry')
        console.log(newEntry);
        chrome.storage.local.set({ entry: newEntry });
    });
    // SHOW NOTIFICATION
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {
            functiontoInvoke: "showNotification",
            text: 'Author added to popup page'
        });
        console.log('sending message');
        console.log(tabs[0])
    });
}

const getData = async () => {
    if (user) {
        const getDatabases = async () => { 
            const res = await fetch('http://localhost:5000/api/database/me', {
            method: 'GET',
            headers: {
                'X-AUTH-TOKEN': user
            }
            }).then(res => res.json())
            console.log(res)
            chrome.storage.local.set({ databases: res.response });
            console.log('updated databases');
        }
        await Promise.all([getDatabases()]);
    }
};

chrome.contextMenus.create({
    id: "parseBibtex",
    title: "Add reference data (except author)",
    contexts: ["selection"],
});

for (let entryType of Object.keys(entryFields)) {
    chrome.contextMenus.create({
        id: `bibtex-${entryType}`,
        title: entryType[0].toUpperCase() + entryType.slice(1),
        parentId: "parseBibtex",
        contexts: ["selection"],
    })
    for (let sep of [',', '.', ';', ':']) {
        chrome.contextMenus.create({
            id: `bibtex-${entryType}-${sep}`,
            title: `Separator: "${sep}"`,
            parentId: `bibtex-${entryType}`,
            contexts: ["selection"],
            onclick: onBibtexClick
        })
    }
};

chrome.contextMenus.create({
    id: 'parseAuthors',
    title: 'Add author(s)',
    contexts: ["selection"],
    onclick: onAuthorClick
});

// LOGIN

let loginTabId;
let user;

chrome.extension.onMessage.addListener((message) => {
    if (message.loginpagecreated) {
        if (!loginTabId) {
            chrome.tabs.create({
                url: chrome.extension.getURL('loginpage/login.html')
            }, () => {
                chrome.tabs.getSelected(null, (tab) => {
                    loginTabId = tab.id;
                })
            })
        }
        else {
            chrome.tabs.update(loginTabId, { highlighted: true });
        }
    }
    if (message.tokenreceived) {
        getData();
        if (loginTabId) {
            user = message.token;
            chrome.storage.local.set({ user });
            chrome.tabs.remove(loginTabId, () => loginTabId = null);
        }
    }
    if (message.logout) {
        user = null;
        chrome.storage.local.set({ user: null });
    }
})

chrome.tabs.onRemoved.addListener((tabId) => {
    if (tabId == loginTabId) {
        loginTabId = null;
    }
})

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ entry: getNewEntry('article'), database: '' });
    chrome.storage.local.get(['user'], data => {
        user = data.user;
        getData();
    })
    setInterval(getData, 1000 * autoUpdateTime);
})