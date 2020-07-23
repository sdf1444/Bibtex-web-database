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

const divTags = document.querySelector('.entry-tags');
const divExtra = document.querySelector('.extra-div');
const typeSelect = document.querySelector('.entry-type-select');
const databaseSelect = document.querySelector('.database-select');
const keyInput = document.querySelector('.input-key');
const mainBibtex = document.querySelector('.bibtex');
const mainLogin = document.querySelector('.login');

const openPopup = (entryType, values) => {
    typeSelect.value = entryType;
    divExtra.classList.add('disabled');
    const l = entryFields[entryType].required.length;
    divTags.querySelector('.entry-keys').innerHTML = '';
    divTags.querySelector('.entry-values').innerHTML = '';
    entryFields[entryType].required.forEach((tag, i) => {
        divTags.querySelector('.entry-keys').innerHTML += (
            `<div class="entry-label">*${tag[0].toUpperCase() + tag.slice(1)}</div>`
        )
        divTags.querySelector('.entry-values').innerHTML += 
        `<div class="entry-draggable">
            <input type="text" class="input-tag" 
            id="${i}" required autocomplete="off"
            value="${values[i] ? values[i] : ''}">
            <div class="entry-drag"></div>
        </div>`
    })
    entryFields[entryType].extra.forEach((tag, i) => {
        divTags.querySelector('.entry-keys').innerHTML += (
            `<div class="entry-label">${tag[0].toUpperCase() + tag.slice(1)}</div>`
        )
        divTags.querySelector('.entry-values').innerHTML += 
        `<div class="entry-draggable">
        <input type="text" class="input-tag" id="${i}"
        value="${values[i+l] ? values[i+l] : ''}" autocomplete="off">
        <div class="entry-drag"></div>
        </div>`;
    })
}

const setDatabases = (databases, selectedDatabase) => {
    databaseSelect.innerHTML = '<option value="" disabled selected>Select a database</option>';
    
    databases.map(database => {
        databaseSelect.innerHTML += `<option value="${database._id}">
        ${database.bibtexdatabasename}</option>`
        if (selectedDatabase._id === database._id) {
            databaseSelect.value = database._id;
        }
    })
}

const submitEntry = async (e) => {
    e.preventDefault();
    console.log('START');
    if (keyInput.value === '') return;
    if (databaseSelect.value === '') return;
    const fields = entryFields[typeSelect.value];
    const l = fields.required.length;
    const entry = { entryType: typeSelect.value, citationKey: keyInput.value, entryTags: {} };
    if (!fields) return;
    document.querySelectorAll('.input-tag').forEach((input, i) => {
        if (input.value !== '');
            entry.entryTags[fields.required[i] || fields.extra[i-l]] = input.value;
    })
    for (let tag of fields.required) {
        if (!entry.entryTags[tag]) return;
    }
    const res = await fetch('http://localhost:5000/api/database/entry', {
        method: 'POST',
        body: JSON.stringify({
            id: databaseSelect.value,
            entry
        }),
        headers: {
            "Content-Type": "application/json",
            "X-AUTH-TOKEN": user
        }
    }).then(res => res.json());
    console.log(res);
    if (res.ok) {
        divTags.querySelector('.entry-keys').innerHTML = '';
        divTags.querySelector('.entry-values').innerHTML = '';
        typeSelect.value = '';
        keyInput.value = '';
        divExtra.classList.remove('disabled');
        chrome.storage.local.set({ entry: null });
        console.log('success');
    }
}

// LOGIN
let user;
chrome.storage.local.get(['user'], data => {
    if (!data.user) {
        mainBibtex.classList.add('disabled');
        mainLogin.classList.remove('disabled');
        mainLogin.querySelector('button').addEventListener('click', e => {
            chrome.extension.sendMessage({ loginpagecreated: true });
        });
    } else {
        mainBibtex.classList.remove('disabled');
        mainLogin.classList.add('disabled');
        user = data.user;
        main();
    }
})

// MAIN CODE

const main = () => {
    document.querySelector('.logout-btn').addEventListener('click', () => {
        chrome.extension.sendMessage({ logout: true });
        mainBibtex.classList.add('disabled');
        mainLogin.classList.remove('disabled');
        mainLogin.querySelector('button').addEventListener('click', e => {
            chrome.extension.sendMessage({ loginpagecreated: true });
        });
    })
    document.querySelector('.bibtex-form').onsubmit = submitEntry;
    typeSelect.onchange = (e) => {
        openPopup(typeSelect.value, []);
    }
    databaseSelect.onchange = (e) => {
        chrome.storage.local.set({ database: databaseSelect.value });
    }

    chrome.storage.local.get(['entry', 'databases', 'database'], data => {
        const entry = data.entry;
        if (entry) {
            const values = entry.string.split(entry.sep);
            openPopup(entry.entryType, values);
        }
        else {
            divExtra.classList.remove('disabled');
        }
        setDatabases(data.databases, data.database);
    })

    const sortable = new Draggable.Sortable(divTags.querySelector('.entry-values'), {
        draggable: '.entry-draggable'
    })

    sortable.on('drag:start', (e) => {
        if (e.data.sensorEvent.data.target.className !== 'entry-drag') {
            e.cancel();
        }
    })

    sortable.on('drag:move', (e) => {
        console.log(e.data.source)
    })
}