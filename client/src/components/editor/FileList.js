import React, { useState, useEffect, useRef, createRef } from 'react';
import PropTypes from 'prop-types';
import {
  getDatabases,
  changeName,
  createDatabase,
  deleteDatabase,
  uploadDatabase,
} from '../../actions/editor';
import './FileList.css';

const FileList = (props) => {
  const handleFileClick = (e) => {
    if (upload) return;
    let chosenDatabase = databases.find((db) => db._id === e.target.id);
    if (state === e.target.id) {
      inputName.current.value = '';
      props.selectDatabase(null);
      setState(null);
    } else {
      inputName.current.value = chosenDatabase.bibtexdatabasename;
      props.selectDatabase(chosenDatabase);
      setState(e.target.id);
    }
  };
  const handleFileNameClick = async () => {
    if (!inputName.current.value) return;
    if (upload) {
      let reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target.readyState != 2) return;
        if (e.target.error) return console.log(e.target.error);
        let fileContent = e.target.result;
        await uploadDatabase(fileContent, inputName.current.value);
        setDatabases(null);
        setUpload(null);
      };
      reader.readAsText(upload);
      return;
    }
    if (state) {
      const chosenDatabase = databases.find((db) => db._id === state);
      if (inputName.current.value !== chosenDatabase.bibtexdatabasename) {
        await changeName(inputName.current.value, chosenDatabase._id);
        setDatabases(null);
      }
    } else {
      await createDatabase(inputName.current.value);
      setDatabases(null);
    }
  };
  const handleDeleteClick = async () => {
    if (!state) return;
    deleteDatabase(state);
    setDatabases(null);
    setState(null);
    props.selectDatabase(null);
  };
  const handleFileUpload = () => {
    const file = inputFile.current.files[0];
    if (!file) return;
    if (file.type === 'text/x-bibtex') {
      inputName.current.value = file.name.split('.').slice(0, -1).join('.');
      setUpload(inputFile.current.files[0]);
      props.selectDatabase(null);
      setState(null);
    }
  };

  const [state, setState] = useState(null);
  const [databases, setDatabases] = useState(null);
  const [upload, setUpload] = useState(null);
  const inputName = useRef(null);
  const inputFile = createRef();

  props.callback('file', setDatabases);
  props.callbackState(setState);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDatabases();
      setDatabases(data);
    };
    if (!databases) {
      fetchData();
    }
  }, [databases]);

  if (!databases) {
    return <div className='file-div'></div>;
  }

  const listDatabases = databases.map((db) => {
    let className = state === db._id ? 'chosen-file' : '';
    let fileName;
    if (db.bibtexdatabasename.length > 15) {
      fileName = db.bibtexdatabasename.slice(0, 18) + '...';
    } else fileName = db.bibtexdatabasename;
    return (
      <button
        key={db._id}
        id={db._id}
        className={className}
        onClick={handleFileClick}
      >
        {fileName}
      </button>
    );
  });
  let btnText;
  if (upload) {
    btnText = 'Upload a database';
  } else if (!state) {
    btnText = 'Add a database';
  } else {
    btnText = 'Save';
  }

  return (
    <div className='file-div'>
      <label className='upload-btn' htmlFor='file'>
        Upload
      </label>
      <input
        type='file'
        name='file'
        id='file'
        onChange={handleFileUpload}
        className='file-upload-input'
        ref={inputFile}
      ></input>
      <div className='file-body'>{listDatabases}</div>
      <div className='file-name'>
        <div className='file-name-label'>Enter a name:</div>
        <input className='file-name-input' ref={inputName}></input>
      </div>
      <div className='file-footer'>
        <button className='delete-db-btn' onClick={handleDeleteClick}>
          Delete a database
        </button>
        <button className='add-db-btn' onClick={handleFileNameClick}>
          {btnText}
        </button>
      </div>
    </div>
  );
};

FileList.propTypes = {
  selectDatabase: PropTypes.func,
  callback: PropTypes.func,
};

export default FileList;
