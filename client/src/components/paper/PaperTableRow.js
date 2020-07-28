import React from 'react';
import PropTypes from 'prop-types';
import './PaperTableRow.css';

const PaperTableRow = (props) => {
    const d = new Date(props.paper.file.uploadDate);
    return (
        <tr>
            <td>
                {props.paper.filename}
            </td>
            <td>{`${d.toLocaleDateString()} ${d.toLocaleTimeString()}`}</td>
            <td>{Math.round(props.paper.file.length / 100) / 10 + 'KB'}</td>
            <td>
                <div className="paper-buttons">
                    <button onClick={e => props.dispatch({
                        type: 'deleteFile',
                        file: props.paper,
                    })} className="remove-btn">Remove</button>
                    <button onClick={e => {
                        props.dispatch({
                            type: 'openWindow',
                            file: props.paper,
                        })
                    }} className="extract-btn">Extract</button>
                    <a className="download-paper-btn"
                    href={props.paper.url}
                    download={`${props.paper.filename}`}>Download</a>
                </div>
            </td>
        </tr>
    )
}

PaperTableRow.propTypes = {
    paper: PropTypes.object.isRequired,
    dispatch: PropTypes.any.isRequired,
    downloadString: PropTypes.any,
}

export default PaperTableRow;
