import React from 'react';
import PropTypes from 'prop-types';
import './PaperTableRow.css';

const PaperTableRow = (props) => {
    const d = new Date(props.file.uploadDate);
    return (
        <tr>
            <td>
                {props.file.filename}
            </td>
            <td>{`${d.toLocaleDateString()} ${d.toLocaleTimeString()}`}</td>
            <td>{Math.round(props.file.length / 100) / 10 + 'KB'}</td>
            <td>
                <div className="paper-buttons">
                    <button onClick={e => props.dispatch({
                        type: 'deleteFile',
                        file: props.file,
                    })} className="remove-btn">Remove</button>
                    <button onClick={e => {
                        props.dispatch({
                            type: 'openWindow',
                            file: props.file,
                        })
                    }} className="extract-btn">Extract</button>
                    <a className="download-paper-btn"
                    href={props.file.url}
                    download={`${props.file.filename}`}>Download</a>
                </div>
            </td>
        </tr>
    )
}

PaperTableRow.propTypes = {
    file: PropTypes.object.isRequired,
    dispatch: PropTypes.any.isRequired,
    downloadString: PropTypes.any,
}

export default PaperTableRow;
