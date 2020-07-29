import axios from 'axios';
import bibtexParse from 'bibtex-parser-js';
import entryFields from '../utils/entryFields';

const typeChange = {
    'ARTICLE': 'article',
    'BOOK': 'book',
    'BOOKLET': 'booklet',
    'CONFERENCE': 'conference',
    'INBOOK': 'inBook',
    'INCOLLECTION': 'inCollection',
    'INPROCEEDINGS': 'inProceedings',
    'MANUAL': 'manual',
    'MASTERSTHESIS': 'mastersThesis',
    'MISC': 'misc',
    'ONLINE': 'online',
    'PHDTHESIS': 'phdThesis',
    'PROCEEDINGS': 'proceedings'
}

const getUserId = async () => {
    const res = await axios.get('/api/auth');
    return res.data.response._id;
}

export const getGroups = async () => {
    const res = await axios.get('/api/group/withme');
    return res.data.response;
}

export const getUser = async () => {
    const res = await axios.get('/api/user/me');
    return res.data;
};

export const getDatabases = async () => {
    const res = await axios.get('/api/database/all');
    return res.data.response;
}

export const changeName = async (newName, databaseId) => {
    try {
        const res = await axios.put(`/api/database`, {
            id: databaseId,
            bibtexdatabasename: newName
        })
        return res;
    } catch (err) {
        return err.response;
    }
}

export const createDatabase = async (bibtexdatabasename, group) => {
    try {
        const res = await axios.post('/api/database', { bibtexdatabasename, group });
        return res;
    } catch (err) {
        return err.response;
    }
}

export const deleteDatabase = async (databaseId) => {
    try {
        const res = await axios.delete(`/api/database/${databaseId}`);
        return res;   
    } catch (err) {
        return err.response;
    }
}

export const addEntry = async (entry, databaseId) => {
    console.log(entry)
    try {
        const res = await axios.post(`/api/database/entry/`, { id: databaseId, entry });
        return res;
    } catch (err) {
        return err.response;
    }
}

export const changeEntry = async (entry, databaseId) => {
    try {
        const res = await axios.put(`/api/database/entry`, { 
            ...entry, 
            entryId: entry._id,
            databaseId,
        });
        return res;
    } catch (err) {
        return err.response;
    }
}

export const deleteEntry = async (entryId, databaseId) => {
    try {
        const res = await axios.delete(`/api/database/entry/${databaseId}/${entryId}`);
        return res;
    } catch (err) {
        return err.response;
    }
}

export const uploadDatabase = async (bibtexFile, name, group) => {
    console.log('GROUP')
    console.log(group)
    const bibtexJSON = bibtexParse.toJSON(bibtexFile);
    console.log(bibtexJSON)
    const entries = [];
    for (let entry of bibtexJSON) {
        entry.entryType = typeChange[entry.entryType];
        if (!entryFields[entry.entryType]) {
            continue;
        }
        for (let tag of Object.keys(entry.entryTags)) {
            if (entryFields[entry.entryType].required.includes(tag.toLowerCase())
            || entryFields[entry.entryType].extra.includes(tag.toLowerCase())) {
                entry.entryTags[tag.toLowerCase()] = entry.entryTags[tag];
            }
            delete entry.entryTags[tag];
        }
        let contains = true;
        for (let tag of entryFields[entry.entryType].required) {
            if (!entry.entryTags[tag]) {
                contains = false;
            }
        }
        if (contains) entries.push(entry);
    }
    const database = { bibtexdatabasename: name, entries };
    try {
        const res = await axios.post(`/api/database/upload`, {
            ...database,
            group: group === 'user' ? null : group,
        });
        console.log(res.data)
        return res;
    } catch (err) {
        console.log(err.response)
        return err.response;
    }
}