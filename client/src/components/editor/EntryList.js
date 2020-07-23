import React, { useEffect } from 'react';
import PropTypes, { element } from 'prop-types';
import { Dropdown, Menu } from 'semantic-ui-react';
import { convertRefs } from '../../actions/bibtex';
import Entry from './Entry';
import './EntryList.css';

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

function parseSearch(search) {
  const result = { entryTags: {} };
  const arr = search.trim().split(' ');
  let typeString = arr.find((str) => str.startsWith('@'));
  if (typeString) {
    result.entryType = typeString.split('@')[1];
  }
  arr.forEach((str) => {
    if (str.split('=').length === 2) {
      const [key, value] = str.split('=');
      result.entryTags[key] = value;
    }
  });
  return result;
}

const EntryList = (props) => {
  useEffect(() => {
    const chosen = document.querySelector('.chosen-entry');
    if (chosen) chosen.scrollIntoView({ behavior: 'smooth' });
  });

  if (!props.active || !props.file) return <div className='entry-div'></div>;

  const searchParams = parseSearch(props.search);
  const entryList =
    Object.keys(searchParams.entryTags).length !== 0 || searchParams.entryType
      ? props.file.entries.filter((entry) => {
          let val = true;
          if (searchParams.entryType) {
            val =
              val &&
              (entry.entryType
                .toLowerCase()
                .startsWith(searchParams.entryType) ||
                entry.entryType.toLowerCase().includes(searchParams.entryType));
          }
          const values = Object.entries(searchParams.entryTags);
          if (values.length !== 0) {
            let matches = false;
            for (let [key, value] of values) {
              if (key === 'citationKey') {
                if (
                  entry[key].startsWith(value) ||
                  entry[key].includes(value)
                ) {
                  matches = true;
                }
                continue;
              }
              if (
                entry.entryTags[key] &&
                (entry.entryTags[key].startsWith(value) ||
                  entry.entryTags[key].includes(value))
              ) {
                matches = true;
              }
            }
            return val && matches;
          }
          return val;
        })
      : props.file.entries;
  const bibtexString = convertRefs(entryList);
  const listDivs = entryList.map((entry) => {
    const isChosen =
      props.selectedEntry && props.selectedEntry._id === entry._id;
    return (
      <Entry
        isChosen={isChosen}
        isNew={false}
        entry={entry}
        key={entry._id}
        onClick={() =>
          props.dispatch({
            type: 'selectEntry',
            entry,
          })
        }
      />
    );
  });

  const newEntryDiv = (
    <Entry
      isChosen={!!props.newEntry}
      isNew={true}
      isDisabled={!props.newEntry}
      entry={props.newEntry}
      key='newEntry'
      onClick={() => props.dispatch({ type: 'unselectNew' })}
    />
  );
  return (
    <div className='entry-div'>
      <Menu compact className='add-entry-btn'>
        <Dropdown
          text='Add entry'
          options={options}
          simple
          item
          onChange={(e, data) => {
            if (props.isSelectedAllowed)
              props.dispatch({
                type: 'selectNew',
                value: data.value,
              });
          }}
        ></Dropdown>
      </Menu>
      <div className='entry-search'>
        <label htmlFor='entry-search'>Find entries</label>
        <input
          className='entry-search-input'
          id='entry-search'
          placeholder='example: @article title=mytitle'
          value={props.search}
          onChange={(e) =>
            props.dispatch({
              type: 'inputSearch',
              value: e.target.value,
            })
          }
        ></input>
      </div>
      <div className='entry-body'>
        {listDivs}
        {newEntryDiv}
      </div>
      <a
        className='download-btn'
        href={`data:text/x-bibtex, ${bibtexString}`}
        download={`${props.file.bibtexdatabasename}.bib`}
      >
        Download
      </a>
    </div>
  );
};

EntryList.propTypes = {
  active: PropTypes.bool.isRequired,
  isSelectedAllowed: PropTypes.bool,
  newEntry: PropTypes.any,
  selectedEntry: PropTypes.any,
  file: PropTypes.any,
  search: PropTypes.string.isRequired,
  dispatch: PropTypes.any.isRequired,
};

export default EntryList;
