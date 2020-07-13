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
  let type = typeChange[entry.type.toUpperCase()];
  delete entry.type;
  const res = await axios.post(`/api/database/${type}/${databaseId}`, entry);
  return res;
};

export const changeEntry = async (entry, databaseId) => {
  let userId = await getUserId();
  let data = {};
  let type = typeChange[entry.type.toUpperCase()];
  console.log('TYPE');
  console.log(entry.type);
  delete entry.type;
  entry.user = userId;
  entry.key = entry.key.toLowerCase();
  data[type] = entry;
  const res = await axios.put(`/api/database/reference/${databaseId}`, data);
  return res;
};

export const deleteEntry = async (entry, databaseId) => {
  const type = entry.type.charAt(0).toLowerCase() + entry.type.slice(1);
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
  console.log(res.data);
  return res;
};

export const getEntries = (database) => {
  let entries = [];
  for (let article of database.article) {
    article.type = 'Article';
    entries.push(article);
  }
  for (let book of database.book) {
    book.type = 'Book';
    entries.push(book);
  }
  for (let booklet of database.booklet) {
    booklet.type = 'Booklet';
    entries.push(booklet);
  }
  for (let conference of database.conference) {
    conference.type = 'Conference';
    entries.push(conference);
  }
  for (let inBook of database.inBook) {
    inBook.type = 'InBook';
    entries.push(inBook);
  }
  for (let inCollection of database.inCollection) {
    inCollection.type = 'InCollection';
    entries.push(inCollection);
  }
  for (let inProceedings of database.inProceedings) {
    inProceedings.type = 'InProceedings';
    entries.push(inProceedings);
  }
  for (let manual of database.manual) {
    manual.type = 'Manual';
    entries.push(manual);
  }
  for (let mastersThesis of database.mastersThesis) {
    mastersThesis.type = 'Masters Thesis';
    entries.push(mastersThesis);
  }
  for (let misc of database.misc) {
    misc.type = 'Misc';
    entries.push(misc);
  }
  for (let online of database.online) {
    online.type = 'Online';
    entries.push(online);
  }
  for (let phdThesis of database.phdThesis) {
    phdThesis.type = 'Phd Thesis';
    entries.push(phdThesis);
  }
  for (let proceedings of database.proceedings) {
    proceedings.type = 'Proceedings';
    entries.push(proceedings);
  }
  return entries;
};
