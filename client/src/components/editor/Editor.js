import React from 'react';
import { Button } from 'semantic-ui-react';
import { Dropdown, Menu } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const options = [
  { key: 1, text: 'Article', value: 1 },
  { key: 2, text: 'Book', value: 2 },
  { key: 3, text: 'Booklet', value: 3 },
  { key: 4, text: 'Conference', value: 4 },
  { key: 5, text: 'InBook', value: 5 },
  { key: 6, text: 'InCollection', value: 6 },
  { key: 7, text: 'InProceedings', value: 7 },
  { key: 8, text: 'Manual', value: 8 },
  { key: 9, text: 'Masters Thesis', value: 9 },
  { key: 10, text: 'Misc', value: 10 },
  { key: 11, text: 'Online', value: 11 },
  { key: 12, text: 'Phd Thesis', value: 12 },
  { key: 13, text: 'Proceedings', value: 13 },
];

const Editor = () => {
  return (
    <div>
      <div className='sidepanelbuttons'>
        <Button.Group>
          <Button>Add new document</Button>
          <Button>Upload</Button>
        </Button.Group>
      </div>
      <div className='entry'>
        <Menu compact>
          <Dropdown text='Add entry' options={options} simple item />
        </Menu>
      </div>
      <div className='editorbuttons'>
        <Button.Group>
          <Button>Edit</Button>
          <Button>Download</Button>
        </Button.Group>
      </div>
    </div>
  );
};

Editor.propTypes = {};

export default Editor;
