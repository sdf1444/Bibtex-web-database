import React, { useEffect, useReducer, createRef } from 'react';
import * as utils from '../../actions/editor';
import './Editor.css';
import entryFields from '../../utils/entryFields';
import FileList from './FileList';
import EntryList from './EntryList';
import InfoList from './InfoList';

function editorReducer(state, action) {
    // console.log(action.type.toUpperCase())
    // console.log(action)
    switch (action.type) {
        //
        // File List
        //
        case 'load': {
            const selectedFile = state.selectedFile ? 
            action.files.find(file => file._id === state.selectedFile._id) : null;
            return {
                ...state,
                isLoading: false,
                fileList: action.files,
                selectedFile,
            }
        }
        case 'inputName': {
            return {
                ...state,
                inputName: action.value
            }
        }
        case 'select' : {
            const selectedFile = (state.selectedFile && 
            action.file._id === state.selectedFile._id) ? null : action.file;
            const name = selectedFile ? selectedFile.bibtexdatabasename : '';
            return {
                ...state,
                uploadedFile: null,
                selectedFile,
                inputName: name,
                inputSearch: '',
                newEntry: null,
            }
        }
        case 'upload': {
            if (action.file.type !== 'text/x-bibtex') {
                return state;
            }
            return {
                ...state,
                uploadedFile: action.file,
                inputName: action.file.name.split('.').slice(0, -1).join('.'),
            }
        }
        case 'delete': {
            if (!state.selectedFile) return state;
            return {
                ...state,
                isDeletingFile: true,
            }
        }
        case 'save': {
            if (!state.inputName) return state;
            if (state.uploadedFile) {
                return {
                    ...state,
                    isUploadingFile: true,
                }
            }
            else if (state.selectedFile) {
                return {
                    ...state,
                    isSavingFile: true,
                }
            }
            else {
                return {
                    ...state,
                    isCreatingFile: true
                }
            }
        }
        case 'finishDeleting': {
            if (!action.ok) {
                return {
                    ...state,
                    isDeletingFile: false,
                }
            }
            return {
                ...state,
                isDeletingFile: false,
                selectedFile: null,
                isLoading: true,
                inputName: '',
            }
        }
        case 'finishSaving': {
            if (!action.ok) {
                return {
                    ...state,
                    isSavingFile: false,
                }
            }
            return {
                ...state,
                isSavingFile: false,
                selectedFile: action.file,
                isLoading: true
            }
        }
        case 'finishCreating': {
            if (!action.ok) {
                return {
                    ...state,
                    isCreatingFile: false,
                }
            }
            return {
                ...state,
                isCreatingFile: false,
                selectedFile: action.file,
                isLoading: true,
                inputName: action.file.bibtexdatabasename,
            }
        }
        case 'finishUploading': {
            if (!action.ok) {
                return {
                    ...state,
                    isUploadingFile: false,
                    uploadedFile: null,
                }
            }
            return {
                ...state,
                isUploadingFile: false,
                uploadedFile: null,
                isLoading: true,
                selectedFile: action.file,
                inputName: action.file.bibtexdatabasename,
            }
        }
        //
        // Entry List
        //
        case 'selectEntry': {
            const selectedEntry = (state.selectedEntry && 
                action.entry._id === state.selectedEntry._id) ? null : action.entry;
            return {
                ...state,
                selectedEntry,
                newEntry: null,
                entryChanges: selectedEntry,
            }
        }
        case 'inputSearch': {
            return {
                ...state,
                inputSearch: action.value,
            }
        }
        case 'selectNew': {
            const newEntry = { entryType: action.value }
            return {
                ...state,
                newEntry,
                selectedEntry: null,
                entryChanges: {
                    ...newEntry,
                    entryTags: {},
                    citationKey: '',
                }
            }
        }
        case 'unselectNew': {
            return {
                ...state,
                newEntry: null,
            }
        }
        //
        // Info List
        //
        case 'inputCitationKey': {
            return {
                ...state,
                entryChanges: {
                    ...state.entryChanges,
                    citationKey: action.value
                }
            }
        }
        case 'inputTag': {
            return {
                ...state,
                entryChanges: {
                    ...state.entryChanges,
                    entryTags: {
                        ...state.entryChanges.entryTags,
                        [action.tag]: action.value
                    }
                }
            }
        }
        case 'deleteEntry': {
            if (state.newEntry) {
                return {
                    ...state,
                    newEntry: null,
                }
            }
            return {
                ...state,
                isDeletingEntry: true,
            }
        }
        case 'saveEntry': {
            for (let tag of entryFields[state.entryChanges.entryType].required) {
                if (!state.entryChanges.entryTags[tag] || 
                state.entryChanges.entryTags[tag] === '') return state;
            }
            if (state.newEntry) {
                return {
                    ...state,
                    isCreatingEntry: true,
                }
            }
            return {
                ...state,
                isSavingEntry: true,
            }
        }
        case 'finishDeletingEntry': {
            if (!action.ok) {
                return {
                    ...state,
                    isDeletingEntry: false,
                }
            }
            return {
                ...state,
                isDeletingEntry: false,
                selectedEntry: null,
                entryChanges: null,
                isLoading: true,
            }
        }
        case 'finishCreatingEntry': {
            if (!action.ok) {
                return {
                    ...state,
                    isCreatingEntry: false,
                }
            }
            return {
                ...state,
                isCreatingEntry: false,
                selectedEntry: action.entry,
                inputSearch: '',
                entryChanges: action.entry,
                isLoading: true,
                newEntry: null,
            }
        }
        case 'finishSavingEntry': {
            if (!action.ok) {
                return {
                    ...state,
                    isSavingEntry: false,
                }
            }
            return {
                ...state,
                isSavingEntry: false,
                selectedEntry: action.entry,
                entryChanges: action.entry,
                isLoading: true,
            }
        }
        default: return state;
    }
}

const Editor = () => {
    const initialState = { 
        isLoading: true,
        isDeletingFile: false,
        isDeletingEntry: false,
        isUploadingFile: false,
        isSavingFile: false,
        isSavingEntry: false,
        isCreatingFile: false,
        isCreatingEntry: false,
        selectedFile: null,
        selectedEntry: null,
        entryChanges: null,
        newEntry: null,
        uploadedFile: null,
        inputName: '',
        inputSearch: '',
    };
    const [state, dispatch] = useReducer(editorReducer, initialState);

    // FETCH
    useEffect(() => {
        const fetchFiles = async () => {
            const files = await utils.getDatabases();
            dispatch({ type: 'load', files });
        }
        if (state.isLoading) fetchFiles();
    }, [state.isLoading])
    // DELETE FILE
    useEffect(() => {
        const deleteFile = async () => {
            const res = await utils.deleteDatabase(state.selectedFile._id);
            dispatch({ type: 'finishDeleting', ok: res.data.ok });
        }
        if (state.isDeletingFile) deleteFile();
    }, [state.isDeletingFile, state.selectedFile])
    // CREATE FILE
    useEffect(() => {
        const createFile = async () => {
            const res = await utils.createDatabase(state.inputName);
            dispatch({ type: 'finishCreating', ok: res.data.ok, file: res.data.response })
        }
        if (state.isCreatingFile) createFile();
    }, [state.isCreatingFile, state.inputName])
    // UPLOAD FILE
    useEffect(() => {
        const uploadFile = async () => {
            const fileReader = new FileReader();
            fileReader.readAsText(state.uploadedFile);
            fileReader.onload = async () => {
                const res = await utils.uploadDatabase(fileReader.result, state.inputName);
                dispatch({ type: 'finishUploading', ok: res.data.ok, file: res.data.response });
            }
            fileReader.onerror = () => {
                console.log(fileReader.error);
                dispatch({ type: 'finishUploading', ok: false });
            }
        }
        if (state.isUploadingFile) uploadFile();
    }, [state.isUploadingFile, state.uploadedFile, state.inputName])
    // CHANGE NAME
    useEffect(() => {
        const changeName = async () => {
            const res = await utils.changeName(state.inputName, 
                state.selectedFile._id);
            dispatch({ type: 'finishSaving', ok: res.data.ok, file: res.data.response })
        }
        if (state.isSavingFile) changeName();
    }, [state.isSavingFile, state.inputName, state.selectedFile])
    // DELETE ENTRY
    useEffect(() => {
        const deleteEntry = async () => {
            const res = await utils.deleteEntry(
                state.selectedEntry._id, 
                state.selectedFile._id
            );
            dispatch({ type: 'finishDeletingEntry', ok: res.data.ok })
        }
        if (state.isDeletingEntry) deleteEntry();
    }, [state.isDeletingEntry, state.selectedFile, state.selectedEntry])
    // CREATE ENTRY
    useEffect(() => {
        const createEntry = async () => {
            const res = await utils.addEntry(state.entryChanges, state.selectedFile._id);
            dispatch({ type: 'finishCreatingEntry', ok: res.data.ok, entry: res.data.response })
        }
        if (state.isCreatingEntry) createEntry();
    }, [state.isCreatingEntry, state.entryChanges, state.selectedFile])
    // SAVE ENTRY
    useEffect(() => {
        const saveEntry = async () => {
            const res = await utils.changeEntry(state.entryChanges, state.selectedFile._id);
            dispatch({ type: 'finishSavingEntry', ok: res.data.ok, entry: res.data.response })
        }
        if (state.isSavingEntry) saveEntry();
    }, [state.isSavingEntry, state.entryChanges])

    const fileActive = !state.isLoading;
    const entryActive = !!state.selectedFile && !state.isLoading;
    const infoActive = !!state.selectedFile && !state.isLoading
    && 
    (
        (!!state.selectedEntry 
        && !!state.selectedFile.entries.find(entry => entry._id === state.selectedEntry._id))
        || !!state.newEntry
    )

    return (
        <div className="Editor">
            <FileList 
            active={fileActive}
            selectedFile={state.selectedFile}
            uploading={!!state.uploadedFile}
            inputName={state.inputName}
            fileList={state.fileList}
            dispatch={dispatch}/>
            <EntryList
            active={entryActive}
            file={state.selectedFile}
            selectedEntry={state.selectedEntry}
            newEntry={state.newEntry}
            search={state.inputSearch}
            dispatch={dispatch}/>
            <InfoList 
            active={infoActive}
            entry={state.selectedEntry || state.newEntry}
            entryChanges={state.entryChanges}
            dispatch={dispatch}/>
        </div>
    );
};

Editor.propTypes = {};

export default Editor;
