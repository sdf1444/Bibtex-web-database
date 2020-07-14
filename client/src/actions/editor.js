import axios from 'axios';
import bibtexParse from 'bibtex-parser-js';
import { object } from 'prop-types';

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
  const res = await axios.get('/api/auth');
  return res.data._id;
};

export const getDatabases = async () => {
  const res = await axios.get('/api/database');
  return res.data;
};

export const changeName = async (newName, databaseId) => {
  const res = await axios.put(`/api/database/reference/${databaseId}`, {
    bibtexdatabasename: newName,
  });
  return res;
};

export const createDatabase = async (bibtexdatabasename) => {
  const res = await axios.post('/api/database', { bibtexdatabasename });
  return res;
};

export const deleteDatabase = async (databaseId) => {
  const res = await axios.delete(`/api/database/${databaseId}`);
  return res;
};

export const addEntry = async (entry, databaseId) => {
  let type = typeChange[entry.typeKey.toUpperCase()];
  console.log(entry);
  delete entry.typeKey;
  const res = await axios.post(`/api/database/${type}/${databaseId}`, entry);
  console.log(res.data);
  return res;
};

export const changeEntry = async (entry, databaseId) => {
  let userId = await getUserId();
  let data = {};
  let type = typeChange[entry.typeKey.toUpperCase()];
  console.log('TYPE');
  console.log(entry.typeKey);
  delete entry.typeKey;
  entry.user = userId;
  entry.key = entry.key.toLowerCase();
  data[type] = entry;
  const res = await axios.put(`/api/database/reference/${databaseId}`, data);
  return res;
};

export const deleteEntry = async (entry, databaseId) => {
  const type = entry.typeKey.charAt(0).toLowerCase() + entry.typeKey.slice(1);
  console.log(`/api/database/${type}/${databaseId}/${entry._id}`);
  const res = await axios.delete(
    `/api/database/${type}/${databaseId}/${entry._id}`
  );
  return res;
};

export const uploadDatabase = async (bibtexFile, name) => {
  const userId = await getUserId();
  const bibtexJSON = bibtexParse.toJSON(bibtexFile);
  let database = { bibtexdatabasename: name };
  for (let type of Object.values(typeChange)) {
    database[type] = [];
  }
  let ref;
  for (let entry of bibtexJSON) {
    if (!Object.keys(typeChange).includes(entry.entryType)) continue;
    ref = { user: userId, key: entry.citationKey.toLowerCase() };
    Object.entries(entry.entryTags).forEach(([key, value]) => {
      ref[key.toLowerCase()] = value;
    });
    database[typeChange[entry.entryType]].push(ref);
  }
  const res = await axios.post(`/api/database/upload`, database);
  return res;
};

export const getEntries = (database) => {
  let entries = [];
  for (let article of database.article) {
    article.typeKey = 'article';
    entries.push(article);
  }
  for (let book of database.book) {
    console.log(book);
    book.typeKey = 'book';
    console.log(book);
    entries.push(book);
  }
  for (let booklet of database.booklet) {
    booklet.typeKey = 'booklet';
    entries.push(booklet);
  }
  for (let conference of database.conference) {
    conference.typeKey = 'conference';
    entries.push(conference);
  }
  for (let inBook of database.inBook) {
    inBook.typeKey = 'inBook';
    entries.push(inBook);
  }
  for (let inCollection of database.inCollection) {
    inCollection.typeKey = 'inCollection';
    entries.push(inCollection);
  }
  for (let inProceedings of database.inProceedings) {
    inProceedings.typeKey = 'inProceedings';
    entries.push(inProceedings);
  }
  for (let manual of database.manual) {
    manual.typeKey = 'manual';
    entries.push(manual);
  }
  for (let mastersThesis of database.mastersThesis) {
    mastersThesis.typeKey = 'mastersThesis';
    console.log(mastersThesis);
    entries.push(mastersThesis);
  }
  for (let misc of database.misc) {
    misc.typeKey = 'misc';
    entries.push(misc);
  }
  for (let online of database.online) {
    online.typeKey = 'online';
    entries.push(online);
  }
  for (let phdThesis of database.phdThesis) {
    phdThesis.typeKey = 'phdThesis';
    entries.push(phdThesis);
  }
  for (let proceedings of database.proceedings) {
    proceedings.typeKey = 'proceedings';
    entries.push(proceedings);
  }
  console.log('ENTRIES');
  console.log(entries);
  return entries;
};
