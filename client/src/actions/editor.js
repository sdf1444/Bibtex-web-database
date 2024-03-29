import axios from 'axios';
import bibtexParse from 'bibtex-parser-js';
import entryFields from '../utils/entryFields';

const typeChange = {
  ARTICLE: 'article',
  BOOK: 'book',
  BOOKLET: 'booklet',
  CONFERENCE: 'conference',
  INBOOK: 'inBook',
  INCOLLECTION: 'inCollection',
  INPROCEEDINGS: 'inProceedings',
  MANUAL: 'manual',
  MASTERSTHESIS: 'mastersThesis',
  MISC: 'misc',
  ONLINE: 'online',
  PHDTHESIS: 'phdThesis',
  PROCEEDINGS: 'proceedings',
};

const getUserId = async () => {
  const res = await axios.get('https://bibtex-webdatabase.herokuapp.com/api/auth');
  return res.data.response._id;
};

export const getGroups = async () => {
  const res = await axios.get('https://bibtex-webdatabase.herokuapp.com/api/group/withme');
  return res.data.response;
};

export const getUser = async () => {
  const res = await axios.get('https://bibtex-webdatabase.herokuapp.com/api/user/me');
  return res.data;
};

export const getDatabases = async () => {
  const res = await axios.get('https://bibtex-webdatabase.herokuapp.com/api/database/all');
  return res.data.response;
};

export const changeName = async (newName, databaseId) => {
  try {
    const res = await axios.put(`https://bibtex-webdatabase.herokuapp.com/api/database`, {
      id: databaseId,
      bibtexdatabasename: newName,
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const createDatabase = async (bibtexdatabasename, group) => {
  try {
    const res = await axios.post('https://bibtex-webdatabase.herokuapp.com/api/database', {
      bibtexdatabasename,
      group,
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const deleteDatabase = async (databaseId) => {
  try {
    const res = await axios.delete(`https://bibtex-webdatabase.herokuapp.com/api/database/${databaseId}`);
    return res;
  } catch (err) {
    return err.response;
  }
};

export const addEntry = async (entry, databaseId) => {
  console.log(entry);
  try {
    const res = await axios.post(`https://bibtex-webdatabase.herokuapp.com/api/database/entry/`, {
      id: databaseId,
      entry,
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const changeEntry = async (entry, databaseId) => {
  try {
    const res = await axios.put(`https://bibtex-webdatabase.herokuapp.com/api/database/entry`, {
      ...entry,
      entryId: entry._id,
      databaseId,
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const deleteEntry = async (entryId, databaseId) => {
  try {
    const res = await axios.delete(
      `https://bibtex-webdatabase.herokuapp.com/api/database/entry/${databaseId}/${entryId}`
    );
    return res;
  } catch (err) {
    return err.response;
  }
};

export const uploadDatabase = async (bibtexFile, name, group) => {
  console.log('GROUP');
  console.log(group);
  let bibtexJSON;
  try {
    bibtexJSON = bibtexParse.toJSON(bibtexFile);
  } catch (err) {
    return {
      data: {
        ok: false,
        error: {
          reason: 'Failed to parse Bibtex file',
        },
      },
    };
  }
  console.log(bibtexJSON);
  const entries = [];
  for (let entry of bibtexJSON) {
    entry.entryType = typeChange[entry.entryType];
    if (!entryFields[entry.entryType]) {
      continue;
    }
    for (let tag of Object.keys(entry.entryTags)) {
      if (
        entryFields[entry.entryType].required.includes(tag.toLowerCase()) ||
        entryFields[entry.entryType].extra.includes(tag.toLowerCase())
      ) {
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
    const res = await axios.post(`https://bibtex-webdatabase.herokuapp.com/api/database/upload`, {
      ...database,
      group: group === 'user' ? null : group,
    });
    console.log(res.data);
    return res;
  } catch (err) {
    console.log(err.response);
    return err.response;
  }
};

const compareEntries = (entryList1, entryList2) => {
  if (entryList1.length !== entryList2.length) {
    return false;
  }
  for (let i = 0; i < entryList1.length; i++) {
    if (entryList1[i].citationKey !== entryList2[i].citationKey) {
      return false;
    }
  }
  return true;
};

export const compareFileLists = (fileList1, fileList2) => {
  if (fileList1.length !== fileList2.length) {
    return false;
  }
  for (let i = 0; i < fileList1.length; i++) {
    if (fileList1[i].bibtexdatabasename !== fileList2[i].bibtexdatabasename) {
      return false;
    }
    if (!compareEntries(fileList1[i].entries, fileList2[i].entries)) {
      return false;
    }
  }
  return true;
};
