import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

class Paper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      file: '',
    };

    this.loadFiles = this.loadFiles.bind(this);
  }

  componentDidMount() {
    this.loadFiles();
  }

  loadFiles() {
    fetch('/api/papers/files')
      .then((res) => res.json())
      .then((files) => {
        if (files.message) {
          console.log('No Files');
          this.setState({ files: [] });
        } else {
          this.setState({ files });
        }
      });
  }

  fileChanged(event) {
    const f = event.target.files[0];
    this.setState({
      file: f,
    });
  }

  deleteFile(event) {
    event.preventDefault();
    const id = event.target.id;

    fetch('/api/papers/files/' + id, {
      method: 'DELETE',
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        if (response.success) this.loadFiles();
        else alert('Delete Failed');
      });
  }

  uploadFile(event) {
    event.preventDefault();
    let data = new FormData();
    data.append('file', this.state.file);

    fetch('/api/papers/files', {
      method: 'POST',
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          this.loadFiles();
        } else {
          alert('Upload failed');
        }
      });
  }

  render() {
    const { files } = this.state;
    return (
      <div className='Paper'>
        <header className='Paper-header'></header>
        <div className='Paper-content'>
          <div className='upload'>
            <input type='file' onChange={this.fileChanged.bind(this)} />
            <button onClick={this.uploadFile.bind(this)}>Upload</button>
          </div>
          <table className='Paper-table'>
            <thead>
              <tr>
                <th>Paper</th>
                <th>Uploaded</th>
                <th>Size</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {files.map((file, index) => {
                var d = new Date(file.uploadDate);
                return (
                  <tr key={index}>
                    <td>
                      <a
                        href={`http://localhost:5000/papers/files/${file.filename}`}
                      >
                        {file.filename}
                      </a>
                    </td>
                    <td>{`${d.toLocaleDateString()} ${d.toLocaleTimeString()}`}</td>
                    <td>{Math.round(file.length / 100) / 10 + 'KB'}</td>
                    <td>
                      <button
                        onClick={this.deleteFile.bind(this)}
                        id={file._id}
                      >
                        Delete
                      </button>
                      <button>Export references</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Paper;
