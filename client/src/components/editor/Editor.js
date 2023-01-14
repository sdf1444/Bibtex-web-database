import React, { useEffect, useReducer, createRef, useRef } from 'react';
import * as utils from '../../actions/editor';
import './Editor.css';
import entryFields from '../../utils/entryFields';
import FileList from './FileList';
import EntryList from './EntryList';
import InfoList from './InfoList';
import EditWindow from './EditWindow';

function editorReducer(state, action) {
  // console.log(action.type.toUpperCase())
  // console.log(action)
  switch (action.type) {
    //
    // File List
    //
    case 'setUser': {
      return { ...state, user: action.user };
    }
    case 'loadNewFiles': {
      return {
        ...state,
        isLoading: true,
      };
    }
    case 'load': {
      const selectedFile = state.selectedFile
        ? action.files.find((file) => file._id === state.selectedFile._id)
        : null;
      return {
        ...state,
        isLoading: false,
        fileList: action.files,
        groups: action.groups,
        selectedFile,
        selectedGroup: 'user',
      };
    }
    case 'inputName': {
      return {
        ...state,
        inputName: action.value,
      };
    }
    case 'select': {
      const selectedFile =
        state.selectedFile && action.file._id === state.selectedFile._id
          ? null
          : action.file;
      const name = selectedFile ? selectedFile.bibtexdatabasename : '';
      return {
        ...state,
        uploadedFile: null,
        selectedFile,
        inputName: name,
        inputSearch: '',
        newEntry: null,
      };
    }
    case 'upload': {
      if (action.file.type !== 'text/x-bibtex') {
        return {
          ...state,
          errorMessage: 'Uploaded file is not bibtex',
        };
      }
      return {
        ...state,
        uploadedFile: action.file,
        inputName: action.file.name.split('.').slice(0, -1).join('.'),
      };
    }
    case 'delete': {
      if (!state.selectedFile)
        return {
          ...state,
          errorMessage: 'No Database selected',
        };
      return {
        ...state,
        isDeletingFile: true,
      };
    }
    case 'save': {
      if (!state.inputName)
        return {
          ...state,
          errorMessage: 'Database name cannot be empty',
        };
      if (state.uploadedFile) {
        return {
          ...state,
          isUploadingFile: true,
        };
      } else if (state.selectedFile) {
        return {
          ...state,
          isSavingFile: true,
        };
      } else {
        return {
          ...state,
          isCreatingFile: true,
        };
      }
    }
    case 'finishDeleting': {
      if (!action.ok) {
        return {
          ...state,
          isDeletingFile: false,
          errorMessage: action.err,
        };
      }
      return {
        ...state,
        isDeletingFile: false,
        selectedFile: null,
        isLoading: true,
        inputName: '',
      };
    }
    case 'finishSaving': {
      if (!action.ok) {
        return {
          ...state,
          isSavingFile: false,
          errorMessage: action.err,
        };
      }
      return {
        ...state,
        isSavingFile: false,
        selectedFile: action.file,
        isLoading: true,
      };
    }
    case 'finishCreating': {
      if (!action.ok) {
        return {
          ...state,
          isCreatingFile: false,
          errorMessage: action.err,
        };
      }
      return {
        ...state,
        isCreatingFile: false,
        selectedFile: action.file,
        isLoading: true,
        inputName: action.file.bibtexdatabasename,
      };
    }
    case 'finishUploading': {
      if (!action.ok) {
        return {
          ...state,
          isUploadingFile: false,
          uploadedFile: null,
          errorMessage: action.err,
        };
      }
      return {
        ...state,
        isUploadingFile: false,
        uploadedFile: null,
        isLoading: true,
        selectedFile: action.file,
        inputName: action.file.bibtexdatabasename,
      };
    }
    //
    // Entry List
    //
    case 'selectEntry': {
      const selectedEntry =
        state.selectedEntry && action.entry._id === state.selectedEntry._id
          ? null
          : action.entry;
      return {
        ...state,
        selectedEntry,
        newEntry: null,
        entryChanges: selectedEntry,
      };
    }
    case 'inputSearch': {
      return {
        ...state,
        inputSearch: action.value,
      };
    }
    case 'selectNew': {
      const newEntry = { entryType: action.value };
      return {
        ...state,
        newEntry,
        selectedEntry: null,
        entryChanges: {
          ...newEntry,
          entryTags: {},
          citationKey: '',
        },
      };
    }
    case 'unselectNew': {
      return {
        ...state,
        newEntry: null,
      };
    }
    //
    // Info List
    //
    case 'inputCitationKey': {
      return {
        ...state,
        entryChanges: {
          ...state.entryChanges,
          citationKey: action.value,
        },
      };
    }
    case 'inputTag': {
      return {
        ...state,
        entryChanges: {
          ...state.entryChanges,
          entryTags: {
            ...state.entryChanges.entryTags,
            [action.tag]: action.value,
          },
        },
      };
    }
    case 'deleteEntry': {
      if (state.newEntry) {
        return {
          ...state,
          newEntry: null,
        };
      }
      return {
        ...state,
        isDeletingEntry: true,
      };
    }
    case 'saveEntry': {
      for (let tag of entryFields[state.entryChanges.entryType].required) {
        if (
          !state.entryChanges.entryTags[tag] ||
          state.entryChanges.entryTags[tag] === ''
        )
          return {
            ...state,
            errorMessage: `Entry field '${tag}' cannot be empty`,
          };
      }
      if (state.entryChanges.citationKey === '')
        return {
          ...state,
          errorMessage: `Citation key cannot be empty`,
        };
      if (state.newEntry) {
        return {
          ...state,
          isCreatingEntry: true,
        };
      }
      return {
        ...state,
        isSavingEntry: true,
      };
    }
    case 'finishDeletingEntry': {
      if (!action.ok) {
        return {
          ...state,
          isDeletingEntry: false,
          errorMessage: action.err,
        };
      }
      return {
        ...state,
        isDeletingEntry: false,
        selectedEntry: null,
        entryChanges: null,
        isLoading: true,
      };
    }
    case 'finishCreatingEntry': {
      if (!action.ok) {
        return {
          ...state,
          isCreatingEntry: false,
          errorMessage: action.err,
        };
      }
      return {
        ...state,
        isCreatingEntry: false,
        selectedEntry: action.entry,
        inputSearch: '',
        entryChanges: action.entry,
        isLoading: true,
        newEntry: null,
      };
    }
    case 'finishSavingEntry': {
      if (!action.ok) {
        return {
          ...state,
          isSavingEntry: false,
          windowOpened: false,
          errorMessage: action.err,
        };
      }
      return {
        ...state,
        isSavingEntry: false,
        windowOpened: false,
        selectedEntry: action.entry,
        entryChanges: action.entry,
        isLoading: true,
      };
    }
    case 'selectGroup': {
      console.log('GROUP');
      console.log(action);
      return {
        ...state,
        selectedGroup: action.group,
      };
    }
    default:
      return state;
    //
    // Edit window
    //
    case 'openWindow': {
      return {
        ...state,
        windowOpened: true,
      };
    }
    case 'closeWindow': {
      return {
        ...state,
        windowOpened: false,
      };
    }
    case 'showError': {
      return {
        ...state,
        errorMessage: action.error,
      };
    }
    case 'removeError': {
      return {
        ...state,
        errorMessage: null,
      };
    }
  }
}

const Editor = () => {
  const initialState = {
    user: null,
    groups: null,
    windowOpened: false,
    selectedGroup: 'user',
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
    errorMessage: null,
    isErrorAppearing: false,
  };
  const [state, dispatch] = useReducer(editorReducer, initialState);
  const timeout = useRef({ error: null, check: null });
  const intervalTime = 5 * 1000;

  // USER
  useEffect(() => {
    const fetchUser = async () => {
      const user = await utils.getUser();
      dispatch({ type: 'setUser', user });
    };
    fetchUser();
  }, []);
  // AUTO REFRESH
  useEffect(() => {
    const checkFiles = async () => {
      console.log('CHECKING');
      const files = await utils.getDatabases();
      if (!utils.compareFileLists(state.fileList, files)) {
        dispatch({ type: 'loadNewFiles' });
      }
    };
    clearInterval(timeout.current.check);
    timeout.current.check = setInterval(checkFiles, intervalTime);
  }, [intervalTime, state.fileList]);
  // FETCH
  useEffect(() => {
    const fetchFiles = async () => {
      const files = await utils.getDatabases();
      const groups = await utils.getGroups();
      dispatch({ type: 'load', files, groups });
    };
    if (state.isLoading) fetchFiles();
  }, [state.isLoading]);
  // DELETE FILE
  useEffect(() => {
    const deleteFile = async () => {
      const res = await utils.deleteDatabase(state.selectedFile._id);
      const err = res.data.error ? res.data.error.reason : null;
      dispatch({ type: 'finishDeleting', ok: res.data.ok, err });
    };
    if (state.isDeletingFile) deleteFile();
  }, [state.isDeletingFile, state.selectedFile]);
  // CREATE FILE
  useEffect(() => {
    const createFile = async () => {
      if (state.selectedGroup === 'user') {
        const res = await utils.createDatabase(state.inputName);
        const err = res.data.error ? res.data.error.reason : null;
        dispatch({
          type: 'finishCreating',
          ok: res.data.ok,
          file: res.data.response,
          err,
        });
      } else {
        const res = await utils.createDatabase(
          state.inputName,
          state.selectedGroup
        );
        const err = res.data.error ? res.data.error.reason : null;
        dispatch({
          type: 'finishCreating',
          ok: res.data.ok,
          file: res.data.response,
          err,
        });
      }
    };
    if (state.isCreatingFile) createFile();
  }, [state.isCreatingFile, state.inputName, state.selectedGroup]);
  // UPLOAD FILE
  useEffect(() => {
    const uploadFile = async () => {
      const fileReader = new FileReader();
      fileReader.readAsText(state.uploadedFile);
      fileReader.onload = async () => {
        const res = await utils.uploadDatabase(
          fileReader.result,
          state.inputName,
          state.selectedGroup
        );
        const err = res.data.error ? res.data.error.reason : null;
        dispatch({
          type: 'finishUploading',
          ok: res.data.ok,
          file: res.data.response,
          err,
        });
      };
      fileReader.onerror = () => {
        console.log(fileReader.error);
        dispatch({
          type: 'finishUploading',
          ok: false,
          err: 'Failed to read Bibtex file',
        });
      };
    };
    if (state.isUploadingFile) uploadFile();
  }, [
    state.isUploadingFile,
    state.uploadedFile,
    state.inputName,
    state.selectedGroup,
  ]);
  // CHANGE NAME
  useEffect(() => {
    const changeName = async () => {
      const res = await utils.changeName(
        state.inputName,
        state.selectedFile._id
      );
      const err = res.data.error ? res.data.error.reason : null;
      dispatch({
        type: 'finishSaving',
        ok: res.data.ok,
        file: res.data.response,
        err,
      });
    };
    if (state.isSavingFile) changeName();
  }, [state.isSavingFile, state.inputName, state.selectedFile]);
  // DELETE ENTRY
  useEffect(() => {
    const deleteEntry = async () => {
      const res = await utils.deleteEntry(
        state.selectedEntry._id,
        state.selectedFile._id
      );
      const err = res.data.error ? res.data.error.reason : null;
      dispatch({ type: 'finishDeletingEntry', ok: res.data.ok, err });
    };
    if (state.isDeletingEntry) deleteEntry();
  }, [state.isDeletingEntry, state.selectedFile, state.selectedEntry]);
  // CREATE ENTRY
  useEffect(() => {
    const createEntry = async () => {
      const res = await utils.addEntry(
        state.entryChanges,
        state.selectedFile._id
      );
      const err = res.data.error ? res.data.error.reason : null;
      dispatch({
        type: 'finishCreatingEntry',
        ok: res.data.ok,
        entry: res.data.response,
        err,
      });
    };
    if (state.isCreatingEntry) createEntry();
  }, [state.isCreatingEntry, state.entryChanges, state.selectedFile]);
  // SAVE ENTRY
  useEffect(() => {
    const saveEntry = async () => {
      const res = await utils.changeEntry(
        state.entryChanges,
        state.selectedFile._id
      );
      const err = res.data.error ? res.data.error.reason : null;
      dispatch({
        type: 'finishSavingEntry',
        ok: res.data.ok,
        entry: res.data.response,
        err,
      });
    };
    if (state.isSavingEntry) saveEntry();
  }, [state.isSavingEntry, state.entryChanges, state.selectedFile]);
  // ERROR
  useEffect(() => {
    const onTimeout = () => {
      dispatch({ type: 'removeError' });
    };

    if (state.errorMessage) {
      if (timeout.current.error) {
        clearTimeout(timeout.current.error);
      }
      timeout.current.error = setTimeout(onTimeout, 6000);
    }
  }, [state.errorMessage]);

  const fileActive = !state.isLoading;
  const entryActive = !!state.selectedFile && !state.isLoading;
  const infoActive =
    !!state.selectedFile &&
    !state.isLoading &&
    ((!!state.selectedEntry &&
      !!state.selectedFile.entries.find(
        (entry) => entry._id === state.selectedEntry._id
      )) ||
      !!state.newEntry);

  const isSelectedAllowed =
    state.selectedFile &&
    ((state.selectedFile.user &&
      state.selectedFile.user._id === state.user._id) ||
      (state.selectedFile.group &&
        (state.selectedFile.group.owner === state.user._id ||
          state.selectedFile.group.users.includes(state.user._id))));

  return (
    <div className='Editor'>
      <div className='main-part'>
        <FileList
          active={fileActive}
          isSelectedAllowed={isSelectedAllowed}
          selectedFile={state.selectedFile}
          uploading={!!state.uploadedFile}
          inputName={state.inputName}
          fileList={state.fileList}
          groups={state.groups}
          user={state.user}
          dispatch={dispatch}
        />
        <EntryList
          active={entryActive}
          isSelectedAllowed={isSelectedAllowed}
          file={state.selectedFile}
          selectedEntry={state.selectedEntry}
          newEntry={state.newEntry}
          search={state.inputSearch}
          dispatch={dispatch}
        />
        <InfoList
          active={infoActive}
          isSelectedAllowed={isSelectedAllowed}
          entry={state.selectedEntry || state.newEntry}
          entryChanges={state.entryChanges}
          dispatch={dispatch}
        />
        <EditWindow
          active={state.windowOpened}
          entry={state.selectedEntry || state.newEntry}
          entryChanges={state.entryChanges}
          dispatch={dispatch}
        />
      </div>
      <div
        className='editor-error-message'
        style={{
          bottom: state.errorMessage ? '60px' : '30px',
          opacity: state.errorMessage ? '1' : '0',
        }}
      >
        {state.errorMessage || ''}
      </div>
    </div>
  );
};

Editor.propTypes = {};

export default Editor;
