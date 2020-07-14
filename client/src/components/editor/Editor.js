import React, { useState, useEffect } from 'react';
import { getDatabases } from '../../actions/editor';
import './Editor.css';
import FileList from './FileList';
import PropTypes from 'prop-types';
import EntryList from './EntryList';
import InfoList from './InfoList';

const options = [
  { key: 1, text: 'Article', value: 'article' },
  { key: 2, text: 'Book', value: 'book' },
  { key: 3, text: 'Booklet', value: 'booklet' },
  { key: 4, text: 'Conference', value: 'conference' },
  { key: 5, text: 'InBook', value: 'inBook' },
  { key: 6, text: 'InCollection', value: 'inCollection' },
  { key: 7, text: 'InProceedings', value: 'inProceedings' },
  { key: 8, text: 'Manual', value: 'manual' },
  { key: 9, text: 'Masters Thesis', value: 'mastersThesis' },
  { key: 10, text: 'Misc', value: 'misc' },
  { key: 11, text: 'Online', value: 'online' },
  { key: 12, text: 'Phd Thesis', value: 'phdThesis' },
  { key: 13, text: 'Proceedings', value: 'proceedings' },
];

const Editor = () => {
  const selectDatabase = (database) => {
    setEntryState(database);
    setInfoState(null);
  }
  const selectEntry = (entry) => {
    setInfoState(entry);
  }
  const refreshDatabases = (database) => {
    setFileState(null);
    chooseFile(null);
    setEntryState(null);
    chooseEntry(null);
    setInfoState(null);   
  }
  const callback = (type, setStateFunc) => {
    switch (type) {
      case 'file':
        setFileState = setStateFunc;
        break;
      case 'entry':
        setEntryState = setStateFunc;
        break;
      case 'info':
        setInfoState = setStateFunc;
        break;
    }
  }
  const callbackState = (setStateFunc) => {
    chooseFile = setStateFunc;
  }
  const callbackEntry = (setStateFunc) => chooseEntry = setStateFunc;

  let setFileState;
  let setEntryState;
  let setInfoState;
  let chooseFile;
  let chooseEntry;
  return (
    <div className="Editor">
      <FileList selectDatabase={selectDatabase} 
      callback={callback} callbackState={callbackState}/>
      <EntryList selectEntry={selectEntry} callback={callback} callbackEntry={callbackEntry}/>
      <InfoList callback={callback} refreshDatabases={refreshDatabases}/>
    </div>
  );
};

Editor.propTypes = {};

export default Editor;
