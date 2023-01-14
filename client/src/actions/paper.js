import axios from 'axios';
import { uploadDatabase } from './editor';
import bibtexParse from 'bibtex-parser-js';
import entryFields from '../utils/entryFields';
import reference from '@devisle/reference-js';
import { xmlToBib } from './bibtex';

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

const extractDatabase = async (bibtexFile, name, group) => {
  console.log('GROUP');
  console.log(group);
  const bibtexJSON = bibtexParse.toJSON(bibtexFile);
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
    const res = await axios.post(`https://bibtex-webdatabase.herokuapp.com/api/database/extract`, {
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

export const getFiles = async () => {
  try {
    const res = await axios.get('https://bibtex-webdatabase.herokuapp.com/api/papers/files');
    return res;
  } catch (err) {
    return err.response;
  }
};

export const deleteFile = async (id) => {
  try {
    const res = await axios.delete(`https://bibtex-webdatabase.herokuapp.com/api/papers/files/${id}`);
    return res;
  } catch (err) {
    return err.response;
  }
};

export const saveFile = async (file, changeProgress) => {
  const data = new FormData();
  data.append('file', file);
  try {
    const res = await axios.post('https://bibtex-webdatabase.herokuapp.com/api/papers/files', data, {
      onUploadProgress: (progressEvent) => {
        const totalLength = progressEvent.lengthComputable
          ? progressEvent.total
          : progressEvent.target.getResponseHeader('content-length') ||
            progressEvent.target.getResponseHeader(
              'x-decompressed-content-length'
            );
        console.log('onUploadProgress', totalLength);
        if (totalLength !== null) {
          changeProgress(
            Math.round((progressEvent.loaded * 100) / totalLength)
          );
        }
      },
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

const extractFile = async (fileId) => {
  const blob = await fetch(`https://bibtex-webdatabase.herokuapp.com/api/papers/files/${fileId}`).then((res) =>
    res.blob()
  );

  const formData = new FormData();
  formData.append('input', blob);

  console.log('SENT');
  const res = await fetch(
    `https://cloud.science-miner.com/grobid/api/processReferences`,
    {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/x-bibtex',
      },
    }
  );
  if (res.status !== 200) return { ok: false, err: 'No references found' };
  const bibBlob = await res.blob();
  return { ok: true, blob: bibBlob };
};

const extractHeader = async (fileId) => {
  const blob = await fetch(`https://bibtex-webdatabase.herokuapp.com/api/papers/files/${fileId}`).then((res) =>
    res.blob()
  );

  const formData = new FormData();
  formData.append('input', blob);
  formData.append('consolidateHeader', '1');

  console.log('SENT');
  const res = await fetch(
    `https://cloud.science-miner.com/grobid/api/processHeaderDocument`,
    {
      method: 'POST',
      body: formData,
    }
  ).then((res) => res.text());
  const bibtex = xmlToBib(res);
  return bibtex;
};

const readUploadedFileAsText = (inputFile) => {
  const temporaryFileReader = new FileReader();
  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new DOMException('Problem parsing input file.'));
    };

    temporaryFileReader.onload = () => {
      resolve(temporaryFileReader.result);
    };
    temporaryFileReader.readAsText(inputFile);
  });
};

export const extractAndUploadBibtex = async (fileId, databaseName, group) => {
  try {
    const blob = await extractFile(fileId);
    if (!blob.ok) return { data: blob };
    const bibtexFile = await readUploadedFileAsText(blob.blob);
    const res = await extractDatabase(bibtexFile, databaseName, group);
    return res;
  } catch (err) {
    return { data: { ok: false, err: err.message } };
  }
};

export const extractAndUploadHeader = async (
  fileId,
  databaseName,
  group,
  citationKey
) => {
  try {
    const bibtex = await extractHeader(fileId);
    if (!bibtex.ok) {
      return {
        data: { ok: false, err: 'Failed to extract citation information' },
      };
    }
    const entry = {
      entryType: 'article',
      entryTags: bibtex.entry,
      citationKey: citationKey,
    };
    const database = { bibtexdatabasename: databaseName, entry };
    try {
      const res = await axios.post(`https://bibtex-webdatabase.herokuapp.com/api/database/header`, {
        ...database,
        group: group === 'user' ? null : group,
      });
      console.log(res.data);
      return res;
    } catch (err) {
      console.log(err.response);
      return {
        data: {
          ok: false,
          err: err.response.data.error.reason,
        },
      };
    }
  } catch (err) {
    console.log(err);
    return { data: { ok: false, err: err.message } };
  }
};

export const getDatabases = async () => {
  const res = await axios.get('https://bibtex-webdatabase.herokuapp.com/api/database/all');
  return res.data.response;
};
