import React from 'react';
import PropTypes from 'prop-types';
import './PaperTableRow.css';

const PaperTableRow = (props) => {
  const d = new Date(props.file.uploadDate);
  return (
    <tr>
      <td>
        <a href={`http://localhost:5000/api/files/${props.file.filename}`}>
          {props.file.filename}
        </a>
      </td>
      <td>{`${d.toLocaleDateString()} ${d.toLocaleTimeString()}`}</td>
      <td>{Math.round(props.file.length / 100) / 10 + 'KB'}</td>
      <td>
        <div className='paper-buttons'>
          <button
            onClick={(e) =>
              props.dispatch({
                type: 'deleteFile',
                file: props.file,
              })
            }
            className='remove-btn'
          >
            Delete
          </button>
          <button
            onClick={(e) => {
              props.dispatch({
                type: 'openWindow',
                file: props.file,
              });
            }}
            className='extract-btn'
          >
            Extract
          </button>
        </div>
      </td>
    </tr>
  );
};

PaperTableRow.propTypes = {
  file: PropTypes.object.isRequired,
  dispatch: PropTypes.any.isRequired,
};

export default PaperTableRow;
