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

// const openPopup = (entryType, values, author) => {
const openPopup = (entry) => {
    console.log('ENTRY')
    console.log(entry);
    typeSelect.value = entry.entryType;
    keyInput.value = entry.citationKey;
    divExtra.classList.add('disabled');
    divTags.querySelector('.entry-keys').innerHTML = '';
    divTags.querySelector('.entry-values').innerHTML = '';
    divTags.querySelector('.entry-keys').innerHTML += (
        `<div class="entry-label" data-key="author">*Author</div>`
    )
    divTags.querySelector('.entry-values').innerHTML += 
    `<div class="entry-draggable">
        <input type="text" class="input-tag"
        placeholder="select the author(s) and upload here"
        id="author" required autocomplete="off"
        value="${entry.entryTags.author}">
        <div class="entry-drag"></div>
    </div>`
    entryFields[entry.entryType].required.forEach((tag, i) => {
        if (tag === 'author') return;
        console.log(tag)
        divTags.querySelector('.entry-keys').innerHTML += (
            `<div class="entry-label" data-key="${tag}">*${tag[0].toUpperCase() + tag.slice(1)}</div>`
        )
        divTags.querySelector('.entry-values').innerHTML += 
        `<div class="entry-draggable">
            <input type="text" class="input-tag" 
            id="${i}" required autocomplete="off"
            value="${entry.entryTags[tag]}">
            <div class="entry-drag"></div>
        </div>`
    })
    entryFields[entry.entryType].extra.forEach((tag, i) => {
        divTags.querySelector('.entry-keys').innerHTML += (
            `<div class="entry-label" data-key="${tag}">${tag[0].toUpperCase() + tag.slice(1)}</div>`
        )
        divTags.querySelector('.entry-values').innerHTML += 
        `<div class="entry-draggable">
        <input type="text" class="input-tag" id="${i}"
        value="${entry.entryTags[tag]}" autocomplete="off">
        <div class="entry-drag"></div>
        </div>`;
    })
}

const setDatabases = (databases, selectedDatabase) => {
    databaseSelect.innerHTML = '<option value="" disabled selected>Select a database</option>';
    console.log('databases');
    console.log(databases);
    console.log(selectedDatabase);
    databases.map(database => {
        databaseSelect.innerHTML += `<option value="${database._id}">
        ${database.bibtexdatabasename}</option>`
    });
    databases.map(database => {
        if (selectedDatabase === database._id) {
            databaseSelect.value = database._id;
        }
    })
}

const getEntryObj = () => {
    const fields = entryFields[typeSelect.value];
    const l = fields.required.length;
    const entry = { entryType: typeSelect.value, citationKey: keyInput.value, entryTags: {} };
    if (!fields) return;
    document.querySelectorAll('.input-tag').forEach((input, i) => {
        const keyTag = Array.from(document.querySelectorAll('.entry-label'))[i].dataset.key;
        entry.entryTags[keyTag] = input.value;
    })
    return entry;
}

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

const submitEntry = async (e) => {
    e.preventDefault();
    console.log('START');
    if (keyInput.value === '') return;
    if (databaseSelect.value === '') return;
    if (!entryFields[typeSelect.value]);
    const entry = getEntryObj();
    for (let tag of entryFields[typeSelect.value].required) {
        if (!entry.entryTags[tag]) return;
    }
    const res = await fetch('https://super-nougat-7e741e.netlify.app/api/database/entry', {
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
        typeSelect.value = 'article';
        databaseSelect.value = '';
        openPopup(getNewEntry(typeSelect.value));
        chrome.storage.local.set({ entry: null, database: '' });
        console.log('success');
        alert('Entry added successfully')
    }
    else if (res.error.reason === "Database contains key dublicates") {
        alert('This citation key is already present in this database');
    } else {
        alert(res.error.reason);
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
    // LOGOUT
    document.querySelector('.logout-btn').addEventListener('click', () => {
        chrome.extension.sendMessage({ logout: true });
        mainBibtex.classList.add('disabled');
        mainLogin.classList.remove('disabled');
        mainLogin.querySelector('button').addEventListener('click', e => {
            chrome.extension.sendMessage({ loginpagecreated: true });
        });
    })
    // SAVE
    document.querySelector('.save-btn').addEventListener('click', () => {
        const entry = getEntryObj();
        if (entry) {
            chrome.storage.local.set({ entry });
        }
        alert('Changes have been saved');
    })
    // SUBMIT
    document.querySelector('.bibtex-form').onsubmit = submitEntry;
    typeSelect.onchange = () => {
        console.log('changed');
        const newEntry = getNewEntry(typeSelect.value);
        openPopup(newEntry);
    }
    databaseSelect.onchange = (e) => {
        chrome.storage.local.set({ database: databaseSelect.value });
    }

    chrome.storage.local.get(['entry', 'databases', 'database', 'author'], data => {
        const entry = data.entry;
        if (entry) {
            openPopup(entry);
        }
        else {
            openPopup(getNewEntry(typeSelect.value));
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