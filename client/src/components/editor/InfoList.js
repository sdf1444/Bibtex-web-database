import React, { useState, useEffect, createRef, useRef } from 'react';
import PropTypes, { object } from 'prop-types';
import { changeEntry, addEntry, deleteEntry } from '../../actions/editor';
import './InfoList.css';

let entryFields = {
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
};

let extraEntryFields = {
  article: ['number', 'pages', 'volume'],
  book: ['series', 'address', 'edition', 'volume'],
  booklet: ['howpublished', 'address'],
  conference: [
    'editor',
    'volume',
    'series',
    'pages',
    'address',
    'organisation',
    'publisher',
  ],
  inBook: ['volume', 'series', 'type', 'address', 'edition'],
  inCollection: [
    'editor',
    'volume',
    'series',
    'type',
    'address',
    'chapter',
    'pages',
    'edition',
    'organization',
  ],
  inProceedings: [
    'editor',
    'volume',
    'series',
    'pages',
    'address',
    'organization',
    'publisher',
  ],
  manual: ['organization', 'address', 'edititon'],
  mastersThesis: ['school', 'type', 'address'],
  misc: ['howpublished'],
  online: ['url'],
  phdThesis: ['type', 'address'],
  proceedings: [
    'editor',
    'volume',
    'series',
    'address',
    'publisher',
    'organization',
  ],
};

for (let [key, value] of Object.entries(entryFields)) {
  entryFields[key].push('author');
  entryFields[key].push('title');
  entryFields[key].push('year');
  entryFields[key].push('key');
}

for (let key of Object.keys(extraEntryFields)) {
  extraEntryFields[key].push('month');
}

const InfoList = (props) => {
  const handleSaveClick = async () => {
    let entryObj = { typeKey: entry.entry.typeKey };
    let refs = Array.from(bodyDiv.current.querySelectorAll('.info')).map(
      (infoDiv) => {
        return [
          infoDiv.querySelector('.info-key').dataset.key,
          infoDiv.querySelector('.info-value').value,
          infoDiv.querySelector('.info-required') ? true : false,
        ];
      }
    );
    for (let [key, input, required] of refs) {
      if (required && input === '') {
        return;
      }
      entryObj[key] = input;
    }
    if (entry.entry.new) {
      entryObj.typeKey = entry.entry.value;
      const res = await addEntry(entryObj, entry.database._id);
      if (res.status === 200) {
        props.refreshDatabases(res.data);
      }
      return;
    }
    const res = await changeEntry(entryObj, entry.database._id);
    if (res.status === 200) props.refreshDatabases(res.data);
  };
  const handleDeleteClick = async () => {
    if (entry.entry.new) return;
    const res = await deleteEntry(entry.entry, entry.database._id);
    if (res.status === 200) {
      props.refreshDatabases(res.data);
    }
  };

  const [entry, setEntry] = useState(null);
  const bodyDiv = useRef(null);

  props.callback('info', setEntry);

  useEffect(() => {
    if (!entry) return;
    Array.from(bodyDiv.current.querySelectorAll('.info')).forEach((infoDiv) => {
      let key = infoDiv.querySelector('.info-key').dataset.key;
      let input = infoDiv.querySelector('.info-value');
      if (entry.entry.new) input.value = '';
      else {
        if (entry.entry[key]) input.value = entry.entry[key];
        else input.value = '';
      }
    });
  });

  if (!entry) {
    return <div className='info-div'></div>;
  }
  let listInfos = [];
  console.log(entry.entry.typeKey);
  for (let key of entryFields[entry.entry.typeKey || entry.entry.value]) {
    listInfos.push(
      <div className='info info-required' key={key}>
        <div className='info-key' data-key={key}>
          *{key}:
        </div>
        <input className='info-value'></input>
      </div>
    );
  }
  for (let key of extraEntryFields[entry.entry.typeKey || entry.entry.value]) {
    listInfos.push(
      <div className='info info-unrequired' key={key}>
        <div className='info-key' data-key={key}>
          {key}:
        </div>
        <input className='info-value'></input>
      </div>
    );
  }

  if (entry.entry.new) entry.entry.typeKey = entry.entry.value;

  return (
    <div className='info-div'>
      <div className='info-head'>{entry.entry.typeKey}</div>
      <div className='info-body' ref={bodyDiv}>
        {listInfos}
      </div>
      <div className='info-footer'>
        <button className='save-btn' onClick={handleSaveClick}>
          Save
        </button>
        <button className='delete-btn' onClick={handleDeleteClick}>
          Delete
        </button>
      </div>
    </div>
  );
};

InfoList.propTypes = {
  callback: PropTypes.func,
  refreshDatabases: PropTypes.func,
};

export default InfoList;
