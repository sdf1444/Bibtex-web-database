import React, { useEffect, useReducer } from 'react';
import * as utils from '../../actions/paper';
import { getGroups } from '../../actions/editor';
import { Table } from 'react-bootstrap';
import PaperTableRow from './PaperTableRow';
import './Paper.css';
import ExtractWindow from './ExtractWindow';

function paperReducer(state, action) {
  switch (action.type) {
    case 'extractBibtex': {
      if (state.isExtracting) return state;
      return {
        ...state,
        isExtracting: true,
        windowMessage: {
          type: 'loading',
          message: 'Extracting...',
        },
      };
    }
    case 'changeProgress': {
      return {
        ...state,
        progress: action.progress,
      };
    }
    case 'setDatabases': {
      return {
        ...state,
        databases: action.databases,
      };
    }
    case 'setGroups': {
      return {
        ...state,
        groups: action.groups,
      };
    }
    case 'selectGroup': {
      return {
        ...state,
        selectedGroup: action.value,
        selected: 'new',
        windowMessage: {},
      };
    }
    case 'selectDatabase': {
      return {
        ...state,
        selected: action.value,
        inputName: action.value !== 'new' ? action.value : '',
        windowMessage: {},
      };
    }
    case 'inputName': {
      return {
        ...state,
        inputName: action.value,
        windowMessage: {},
      };
    }
    case 'searchName': {
      return {
        ...state,
        searchName: action.value,
      };
    }
    case 'uploadFile': {
      console.log(action.file);
      if (!action.file || action.file.type !== 'application/pdf')
        return {
          ...state,
          uploadedFile: null,
        };
      return {
        ...state,
        uploadedFile: action.file,
      };
    }
    case 'closeUploaded': {
      return {
        ...state,
        uploadedFile: null,
      };
    }
    case 'saveFile': {
      return {
        ...state,
        isSaving: true,
        progress: 0,
      };
    }
    case 'deleteFile': {
      return {
        ...state,
        isDeleting: true,
        deletedFile: action.file,
      };
    }
    case 'openWindow': {
      return {
        ...state,
        windowOpened: true,
        extractedFile: action.file,
      };
    }
    case 'closeWindow': {
      if (state.isExtracting) return state;
      return {
        ...state,
        windowOpened: false,
        windowMessage: {},
      };
    }
    case 'finishLoading': {
      console.log(action.papers);
      return {
        ...state,
        isLoading: false,
        papers: action.papers,
        windowMessage: {},
      };
    }
    case 'finishDeleting': {
      if (!action.ok) return { ...state, isDeleting: false };
      return {
        ...state,
        isDeleting: false,
        isLoading: true,
      };
    }
    case 'finishSaving': {
      if (!action.ok) return { ...state, isSaving: false };
      return {
        ...state,
        isSaving: false,
        isLoading: true,
        progress: null,
      };
    }
    case 'finishExtracting': {
      if (!action.ok)
        return {
          ...state,
          windowMessage: {
            type: 'err',
            message: action.err,
          },
          isExtracting: false,
        };
      return {
        ...state,
        isExtracting: false,
        windowMessage: {
          type: 'success',
          message: 'File uploaded',
        },
      };
    }
    default:
      return state;
  }
}

const Paper = () => {
  const initialState = {
    progress: null,
    isLoading: true,
    isDeleting: false,
    isSaving: false,
    isExtracting: false,
    windowOpened: false,
    papers: null,
    uploadedFile: null,
    deletedFile: null,
    extractedFile: null,
    groups: null,
    databases: null,
    selectedGroup: 'personal',
    selected: null,
    inputName: '',
    searchName: '',
    windowMessage: {},
  };

  const [state, dispatch] = useReducer(paperReducer, initialState);

  useEffect(() => {
    const setDatabases = async () => {
      const databases = await utils.getDatabases();
      dispatch({
        type: 'setDatabases',
        databases,
      });
    };
    const setGroups = async () => {
      const groups = await getGroups();
      dispatch({
        type: 'setGroups',
        groups,
      });
    };
    setGroups();
    setDatabases();
  }, []);
  useEffect(() => {
    const loadFiles = async () => {
      const res = await utils.getFiles();
      const papers = res.data.response;
      const promises = [];
      console.log(papers);
      for (let paper of papers) {
        promises.push(
          fetch(`/api/papers/files/${paper.file._id}`)
            .then((res) => res.blob())
            .then((blob) => {
              const url = window.URL.createObjectURL(blob);
              paper.url = url;
            })
        );
      }
      console.log(papers);
      await Promise.all(promises);
      dispatch({
        type: 'finishLoading',
        papers,
      });
    };
    if (state.isLoading) loadFiles();
  }, [state.isLoading]);
  useEffect(() => {
    const deleteFile = async () => {
      const res = await utils.deleteFile(state.deletedFile.file._id);
      dispatch({
        type: 'finishDeleting',
        ok: res.data.ok,
      });
    };
    if (state.isDeleting) deleteFile();
  }, [state.isDeleting, state.deletedFile]);
  useEffect(() => {
    const saveFile = async () => {
      const res = await utils.saveFile(state.uploadedFile, (n) => {
        dispatch({
          type: 'changeProgress',
          progress: n,
        });
      });
      dispatch({
        type: 'finishSaving',
        ok: res.data.ok,
        file: res.data.response,
      });
    };
    if (state.isSaving) saveFile();
  }, [state.isSaving, state.uploadedFile]);
  useEffect(() => {
    const extractBibtex = async () => {
      if (!state.inputName) {
        return dispatch({
          type: 'finishExtracting',
          ok: false,
          err: 'Database name cannot be empty',
        });
      }
      console.log(state.inputName);
      const res = await utils.extractAndUploadBibtex(
        state.extractedFile.file._id,
        state.inputName,
        state.selectedGroup === 'personal' ? null : state.selectedGroup
      );
      console.log(res);
      console.log(res.data);
      dispatch({
        type: 'finishExtracting',
        ok: res.data.ok,
        err: res.data.err,
        file: res.data.response,
      });
    };
    if (state.isExtracting) extractBibtex();
  }, [
    state.isExtracting,
    state.extractedFile,
    state.inputName,
    state.selectedGroup,
  ]);

  if (state.isLoading || !state.papers) {
    return <div className='Paper'>Loading</div>;
  }

  const paperFilter = (paper) => {
    if (state.searchName === '') {
      return true;
    }
    return paper.filename.includes(state.searchName);
  };

  const dataTable = state.papers
    .filter(paperFilter)
    .map((paper) => {
      return (
        <PaperTableRow paper={paper} dispatch={dispatch} key={paper._id} />
      );
    })
    .reverse();
  const uploadText = state.uploadedFile
    ? state.uploadedFile.name
    : 'No file selected';

  return (
    <div className='Paper'>
      <div
        className={
          state.windowOpened ? 'paper-layout' : 'paper-layout disabled'
        }
        onClick={(e) => dispatch({ type: 'closeWindow' })}
      ></div>
      <ExtractWindow
        active={state.windowOpened}
        file={state.extractedFile}
        groups={state.groups}
        selectedGroup={state.selectedGroup}
        databases={state.databases}
        inputValue={state.inputName}
        windowMessage={state.windowMessage}
        selected={state.selected}
        dispatch={dispatch}
      />
      <div className='w3-light-grey'>
        <div
          className={`w3-container w3-blue w3-center ${
            state.progress ? '' : 'disabled'
          }`}
          style={{
            width: state.progress || 0 + '%',
          }}
        >
          {state.progress || 0}%
        </div>
      </div>
      <div className='paper-header'>
        <div className='search-label'>Search by file name: </div>
        <input
          className='search-paper'
          value={state.searchName}
          onChange={(e) =>
            dispatch({
              type: 'searchName',
              value: e.target.value,
            })
          }
        ></input>
        <input
          type='file'
          id='paper-file'
          className='upload-input'
          onChange={(e) =>
            dispatch({
              type: 'uploadFile',
              file: e.target.files[0],
            })
          }
        ></input>
        <label htmlFor='paper-file' className='upload-label'>
          Choose a file
        </label>
        <button
          className={`upload-file-btn ${state.uploadedFile ? '' : 'disabled'}`}
          onClick={(e) =>
            dispatch({
              type: 'saveFile',
            })
          }
        >
          Upload
        </button>
        <div
          className={`upload-file-name ${
            state.uploadedFile ? 'activated' : ''
          }`}
        >
          {uploadText}
        </div>
        <button
          className={`remove-uploaded ${state.uploadedFile ? '' : 'disabled'}`}
          onClick={(e) =>
            dispatch({
              type: 'closeUploaded',
            })
          }
        >
          x
        </button>
      </div>
      <div className='paper-wrapper'>
        <Table className='paper-table' striped bordered hover>
          <thead>
            <tr>
              <th>Paper</th>
              <th>Uploaded</th>
              <th>Size</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{dataTable}</tbody>
        </Table>
      </div>
    </div>
  );
};

export default Paper;
