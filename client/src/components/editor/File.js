import React from 'react';
import PropTypes from 'prop-types';
import './File.css';

const File = (props) => {
  const info = props.file.user
    ? { label: 'User', name: props.file.user.name }
    : { label: 'Group', name: props.file.group.name };
  const d = new Date(props.file.updatedAt);
  return (
    <div
      className={props.isSelected ? 'file-box chosen-file' : 'file-box'}
      onClick={(e) =>
        props.dispatch({
          type: 'select',
          file: props.file,
        })
      }
    >
      <div className='file-head'>
        <div className='file-bibtex-name'>{props.file.bibtexdatabasename}</div>
        <img
          className={`file-icon ${!props.isAllowed ? '' : 'disabled'}`}
          src='https://www.pngmart.com/files/12/Corona-Lockdown-PNG-Clipart.png'
          alt=''
        ></img>
      </div>
      <div className='file-info'>
        <div className='file-info-label'>{info.label}:</div>
        <div className='file-info-name'>{info.name}</div>
      </div>
      <div className='file-date-label'>Last updated:</div>
      <div className='file-date'>
        {d.toLocaleDateString()} {d.toLocaleTimeString()}
      </div>
    </div>
  );
};

File.propTypes = {
  file: PropTypes.any.isRequired,
  isSelected: PropTypes.bool,
  isAllowed: PropTypes.bool,
  dispatch: PropTypes.any.isRequired,
};

export default File;
