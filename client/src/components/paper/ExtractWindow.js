import React from 'react';
import PropTypes from 'prop-types';
import './ExtractWindow.css';

const ExtractWindow = (props) => {
  if (!props.active) {
    return <div className='paper-window disabled'></div>;
  }
  const groupOptions = props.groups.map((group, i) => {
    return {
      key: i,
      text: group.name,
      value: group._id,
    };
  });
  groupOptions.push({
    key: props.groups.length,
    text: 'Personal',
    value: 'personal',
  });
  const options = props.databases
    .filter((database) => {
      if (props.selectedGroup === 'personal') {
        return database.user;
      }
      return database.group && database.group._id === props.selectedGroup;
    })
    .map((database, i) => {
      return {
        key: i,
        text: database.bibtexdatabasename,
        value: database.bibtexdatabasename,
      };
    });
  options.push({
    key: props.databases.length,
    text: 'New database',
    value: 'new',
  });

  return (
    <div className='paper-window'>
      <div className='paper-window-file'>{props.file.filename}</div>
      <div className='select-method-label'>Select Extraction Method</div>
      <div className='select-method-btn'>
        <select
          className='select-method'
          placeholder='Select extraction method'
          value={props.method}
          onChange={(e) =>
            props.dispatch({
              type: 'selectMethod',
              value: e.target.value,
            })
          }
        >
          <option value='header'>Single reference (Header)</option>
          <option value='references'>All references</option>
        </select>
      </div>
      <div className='select-group-label'>Select a group</div>
      <div className='select-group-btn'>
        <select
          className='select-group'
          placeholder='Select a group'
          value={props.selectedGroup}
          onChange={(e) =>
            props.dispatch({
              type: 'selectGroup',
              value: e.target.value,
            })
          }
        >
          {groupOptions.map((option) => (
            <option value={option.value} key={option.key}>
              {option.text}
            </option>
          ))}
        </select>
      </div>
      <div className='select-database-label'>Select a database</div>
      <div className='select-database-btn'>
        <select
          className='select-database'
          placeholder='Select a database'
          disabled={!props.selectedGroup}
          value={props.selected || 'new'}
          onChange={(e) =>
            props.dispatch({
              type: 'selectDatabase',
              value: e.target.value,
            })
          }
        >
          {options.map((option) => (
            <option value={option.value} key={option.key}>
              {option.text}
            </option>
          ))}
        </select>
      </div>
      <div className='name-label'>Enter a name</div>
      <input
        className='name-input'
        id='database-name'
        autoComplete='off'
        readOnly={props.selected && props.selected !== 'new'}
        value={props.inputValue}
        onChange={(e) =>
          props.dispatch({
            type: 'inputName',
            value: e.target.value,
          })
        }
      ></input>
      <div
        className={`extra-input ${props.method === 'header' ? '' : 'disabled'}`}
      >
        <div className='name-label'>Enter Citation Key</div>
        <input
          className='name-input'
          id='citation-key'
          autoComplete='off'
          placeholder='Enter new Citation Key'
          readOnly={props.method !== 'header'}
          value={props.citationKey}
          onChange={(e) =>
            props.dispatch({
              type: 'changeCitationKey',
              value: e.target.value,
            })
          }
        ></input>
      </div>

      <div className={`message-div ${props.windowMessage.type || ''}`}>
        {props.windowMessage.message || ''}
      </div>
      <button
        className='paper-extract'
        onClick={(e) =>
          props.dispatch({
            type: 'extractBibtex',
          })
        }
      >
        Extract
      </button>
    </div>
  );
};

ExtractWindow.propTypes = {
  active: PropTypes.bool.isRequired,
  file: PropTypes.object,
  databases: PropTypes.array,
  groups: PropTypes.array,
  citationKey: PropTypes.string.isRequired,
  selectedGroup: PropTypes.any,
  inputValue: PropTypes.string.isRequired,
  selected: PropTypes.string,
  windowMessage: PropTypes.object.isRequired,
  dispatch: PropTypes.any.isRequired,
  method: PropTypes.string.isRequired,
};

export default ExtractWindow;
