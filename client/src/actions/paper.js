import axios from 'axios';
import { uploadDatabase } from './editor';

export const getFiles = async () => {
  try {
    const res = await axios.get('/api/papers/files');
    return res;
  } catch (err) {
    return err.response;
  }
};

export const deleteFile = async (id) => {
  try {
    const res = await axios.delete(`/api/papers/files/${id}`);
    return res;
  } catch (err) {
    return err.response;
  }
};

export const saveFile = async (file, changeProgress) => {
  const data = new FormData();
  data.append('file', file);
  try {
    const res = await axios.post('/api/papers/files', data, {
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

const extractFile = async (filename) => {
  const blob = await fetch(`/api/papers/files/${filename}`).then((res) =>
    res.blob()
  );

  const formData = new FormData();
  formData.append('input', blob);

  console.log('SENT');
  const res = await fetch(`http://localhost:8070/api/processReferences`, {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/x-bibtex',
    },
  });
  if (res.status !== 200) return { ok: false, err: 'No references found' };
  const bibBlob = await res.blob();
  return { ok: true, blob: bibBlob };
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

export const extractAndUploadBibtex = async (filename, databaseName, group) => {
  try {
    const blob = await extractFile(filename);
    if (!blob.ok) return { data: blob };
    const bibtexFile = await readUploadedFileAsText(blob.blob);
    const res = await uploadDatabase(bibtexFile, databaseName, group);
    return res;
  } catch (err) {
    return { data: { ok: false, err: err.message } };
  }
};

export const getDatabases = async () => {
  const res = await axios.get('/api/database');
  return res.data.response;
};
