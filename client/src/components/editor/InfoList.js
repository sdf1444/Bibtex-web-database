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

for (let [key, value] of Object.entries(entryFields)) {
  entryFields[key].push('author');
  entryFields[key].push('title');
  entryFields[key].push('year');
  entryFields[key].push('key');
}

const InfoList = (props) => {
  const handleSaveClick = async () => {
    let entryObj = {};
    let refs = Array.from(bodyDiv.current.querySelectorAll('.info')).map(
      (infoDiv) => {
        return [
          infoDiv.querySelector('.info-key').dataset.key,
          infoDiv.querySelector('.info-value').value,
        ];
      }
    );
    for (let [key, input] of refs) {
      if (input === '') {
        return;
      }
      entryObj[key] = input;
    }
    if (entry.entry.new) {
      entryObj.type = entry.entry.value;
      const res = await addEntry(entryObj, entry.database._id);
      console.log(res.data);
      if (res.status === 200) {
        props.refreshDatabases(res.data);
      }
      return;
    }
    let type = entry.entry.type;
    entryObj.type = type.charAt(0).toLowerCase() + type.slice(1);
    const res = await changeEntry(entryObj, entry.database._id);
    if (res.status === 200) props.refreshDatabases(res.data);
  };
  const handleDeleteClick = async () => {
    if (entry.entry.new) return;
    const res = await deleteEntry(entry.entry, entry.database._id);
    console.log(res.data);
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
      else input.value = entry.entry[key];
    });
  });

  if (!entry) {
    return <div className='info-div'></div>;
  }

  let listInfos;
  if (!entry.entry.new) {
    listInfos = Object.entries(entry.entry).map(([key, value]) => {
      if (key === 'type' || key === '_id' || key === 'user') {
        return;
      }
      return (
        <div className='info' key={key}>
          <div className='info-key' data-key={key}>
            {key}:
          </div>
          <input className='info-value' data-key={key}></input>
        </div>
      );
    });
  } else {
    listInfos = entryFields[entry.entry.value].map((key) => {
      return (
        <div className='info' key={key}>
          <div className='info-key' data-key={key}>
            {key}:
          </div>
          <input className='info-value'></input>
        </div>
      );
    });
  }

  if (entry.entry.new)
    entry.entry.type =
      entry.entry.value.charAt(0).toUpperCase() + entry.entry.value.slice(1);

  return (
    <div className='info-div'>
      <div className='info-head'>{entry.entry.type}</div>
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
