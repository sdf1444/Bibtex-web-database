import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { convertRefs } from '../../actions/bibtex';
import { getEntries } from '../../actions/editor'
import { Dropdown, Menu } from 'semantic-ui-react';
import './EntryList.css';

const options = [
    { key: 1, text: 'Article', value: 'article' },
    { key: 2, text: 'Book', value: 'book' },
    { key: 3, text: 'Booklet', value: 'booklet' },
    { key: 4, text: 'Conference', value: 'conference' },
    { key: 5, text: 'InBook', value: 'inBook' },
    { key: 6, text: 'InCollection', value: 'inCollection' },
    { key: 7, text: 'InProceedings', value: 'inProceedings' },
    { key: 8, text: 'Manual', value: 'manual' },
    { key: 9, text: 'Masters Thesis', value: 'mastersThesis' },
    { key: 10, text: 'Misc', value: 'misc' },
    { key: 11, text: 'Online', value: 'online' },
    { key: 12, text: 'Phd Thesis', value: 'phdThesis' },
    { key: 13, text: 'Proceedings', value: 'proceedings' },
];

const EntryList = (props) => {
    const handleEntryClick = (e) => {
        let chosenEntry = entries.find(entry => entry._id === e.target.id);
        if (state === e.target.id) {
            props.selectEntry(null);
            setState(null);
        }
        else {
            props.selectEntry({ entry: chosenEntry, database: database });
            setState(e.target.id);
        }
    }
    const handleAddEntryClick = (e, data) => {
        setState({ new: true, value: data.value });
        props.selectEntry({ entry: { new: true, value: data.value }, database: database });
    }
    const unselectNew = () => {
        props.selectEntry(null);
        setState(null);
    }

    const [state, setState] = useState(null); 
    const [database, setDatabase] = useState(null);

    props.callback('entry', setDatabase);
    props.callbackEntry(setState);

    if (!database) {
        return (
            <div className="entry-div"></div> 
        )
    }

    const entries = getEntries(database);
    const bibtexString = convertRefs(entries);
    const listEntries = entries.map(entry => {
        let className = state === entry._id ? 'entry chosen-entry' : 'entry';
        let entryName=`@${entry.typeKey} title=${entry.title} author=${entry.author} year=${entry.year}`
        return (
            <button className={className} key={entry._id} 
            id={entry._id} onClick={handleEntryClick}>
                {entryName}
            </button>
        )
    })
    const newClassname = state && state.new ? 'entry-new chosen-entry' : 'entry-new disabled';
    const newText = state ? `New ${state.value}` : ''
    let newEntryDiv = (
        <button className={newClassname} onClick={unselectNew}>{newText}</button>
    )
    return (
        <div className="entry-div">
            <Menu compact className="add-entry-btn">
                <Dropdown text="Add entry" options={options} 
                simple item onChange={handleAddEntryClick}></Dropdown>
            </Menu>
            <div className="entry-body">
                {listEntries}
                {newEntryDiv}
            </div>
            <a className="download-btn" href={`data:text/x-bibtex, ${bibtexString}`} 
            download={`${database.bibtexdatabasename}.bib`}>Download</a>
        </div>
    )
}

EntryList.propTypes = {
    selectEntry: PropTypes.func,
    callback: PropTypes.func,
}

export default EntryList;