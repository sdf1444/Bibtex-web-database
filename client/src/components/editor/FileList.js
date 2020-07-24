import React from 'react';
import PropTypes from 'prop-types';
import './FileList.css';
import File from './File';

const FileList = (props) => {
    if (!props.active || !props.fileList) return <div className="file-div"></div>

    const listDivs = props.fileList.map(file => {
        const isAllowed = (file.user && file.user._id === props.user._id)
        || (file.group && (file.group.owner === props.user._id
        || file.group.users.includes(props.user._id)));
        return (
            <File key={file._id} file={file} 
            isSelected={props.selectedFile && props.selectedFile._id === file._id}
            isAllowed={isAllowed}
            dispatch={props.dispatch}></File>
        )
    })

    let btnText;
    if (props.uploading) btnText = 'Upload a database'
    else if (!props.selectedFile) btnText = 'Add a database'
    else btnText = 'Save'

    return (
        <div className="file-div">
            <label className="upload-btn" 
            htmlFor="file">Upload</label>
            <input type="file" name="file" id="file" onChange={e => props.dispatch({
                type: 'upload',
                file: e.target.files[0],
            })}
            className="file-upload-input"></input>
            <div className="file-body">
                {listDivs}
            </div>
            <select className={`file-group ${!props.selectedFile || props.uploading ? 
            '' : 'disabled'}`}
            onChange={e => props.dispatch({
                type: 'selectGroup',
                group: e.target.value,
            })}>
            <option value="user">Personal Database</option>
                {props.groups.map(group =><option 
                value={group._id}
                key={group._id}>{group.name}</option>)}
            </select>
            <div className={`file-name ${props.isSelectedAllowed || !props.selectedFile ? 
                '' : 'disabled'}`}>
                <div className="file-name-label">Enter a name:</div>
                <input className="file-name-input" value={props.inputName}
                onChange={e => props.dispatch({
                    type: 'inputName',
                    value: e.target.value,
                })}></input>
            </div>
            <div className={`file-footer ${props.isSelectedAllowed || !props.selectedFile ? 
                '' : 'disabled'}`}>
                <button className="delete-db-btn" 
                onClick={e => props.dispatch({ type: 'delete' })}>Delete a database</button>
                <button className="add-db-btn" onClick={e => props.dispatch({
                    type: 'save',
                })}>{btnText}</button>
            </div>
        </div>
    )
}

FileList.propTypes = {
    groups: PropTypes.any,
    active: PropTypes.bool.isRequired,
    selectedFile: PropTypes.any, // id of selected database
    uploading: PropTypes.any.isRequired,
    inputName: PropTypes.string.isRequired,
    fileList: PropTypes.array,
    isSelectedAllowed: PropTypes.bool,
    dispatch: PropTypes.any.isRequired
}

export default FileList;