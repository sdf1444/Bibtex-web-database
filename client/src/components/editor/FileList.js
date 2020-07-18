import React from 'react';
import PropTypes from 'prop-types';
import './FileList.css';

const FileList = (props) => {
  if (!props.active || !props.fileList) return <div className='file-div'></div>;

  const listDivs = props.fileList.map((file) => {
    const className =
      props.selectedFile && props.selectedFile._id === file._id
        ? 'chosen-file'
        : '';
    const fileName =
      file.bibtexdatabasename > 15
        ? file.bibtexdatabasename.slice(0, 18) + '...'
        : file.bibtexdatabasename;
    return (
      <button
        key={file._id}
        id={file._id}
        className={className}
        onClick={(e) =>
          props.dispatch({
            type: 'select',
            file: file,
          })
        }
      >
        {fileName}
      </button>
    );
  });

  let btnText;
  if (props.uploading) btnText = 'Upload a database';
  else if (!props.selectedFile) btnText = 'Add a database';
  else btnText = 'Save';

  return (
    <div className='file-div'>
      <label className='upload-btn' htmlFor='file'>
        Upload
      </label>
      <input
        type='file'
        name='file'
        id='file'
        onChange={(e) =>
          props.dispatch({
            type: 'upload',
            file: e.target.files[0],
          })
        }
        className='file-upload-input'
      ></input>
      <div className='file-body'>{listDivs}</div>
      <div className='file-name'>
        <div className='file-name-label'>Enter a name:</div>
        <input
          className='file-name-input'
          value={props.inputName}
          onChange={(e) =>
            props.dispatch({
              type: 'inputName',
              value: e.target.value,
            })
          }
        ></input>
      </div>
      <div className='file-footer'>
        <button
          className='delete-db-btn'
          onClick={(e) => props.dispatch({ type: 'delete' })}
        >
          Delete a database
        </button>
        <button
          className='add-db-btn'
          onClick={(e) =>
            props.dispatch({
              type: 'save',
            })
          }
        >
          {btnText}
        </button>
      </div>
    </div>
  );
};

FileList.propTypes = {
  active: PropTypes.bool.isRequired,
  selectedFile: PropTypes.any, // id of selected database
  uploading: PropTypes.any.isRequired,
  inputName: PropTypes.string.isRequired,
  fileList: PropTypes.array,
  dispatch: PropTypes.any.isRequired,
};

export default FileList;
