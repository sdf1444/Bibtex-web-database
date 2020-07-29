import React from 'react';
import PropTypes from 'prop-types';
import './Entry.css';

const Entry = (props) => {
    const entryClass = props.isChosen ? 'entry chosen-entry' : 'entry';
    if (props.isNew && props.isDisabled) 
        return <button className='entry-new disabled'></button>
    else if (props.isNew) return (
        <button className="entry-new chosen-entry" onClick={props.onClick}>
            <div className="entry-text">
                <p>
                    new <span className="entry-text-new">{props.entry.entryType}</span>
                </p>
            </div>
        </button>
    )
    return (
        <button className={entryClass} onClick={props.onClick}>
            <div className="entry-text">
                <p className="entry-header">
                    <span
                    className="entry-type">@{props.entry.entryType}
                    </span>{'{'}<span
                    className="entry-key">{props.entry.citationKey}</span>
                </p>
                <div className="entry-title-cont entry-cont">
                    <div className="entry-title">title</div>
                    <div className="entry-eq">=</div>
                    <div className="entry-tag">{props.entry.entryTags.title}</div>
                </div>
                <div className="entry-author-cont entry-cont">
                    <div className="entry-author">author</div>
                    <div className="entry-eq">=</div>
                    <div className="entry-tag">{props.entry.entryTags.author}</div>
                </div>
                <div className="entry-year-cont entry-cont">
                    <div className="entry-year">year</div>
                    <div className="entry-eq">=</div>
                    <div className="entry-tag">{props.entry.entryTags.year}</div>
                </div>
                <p className="entry-footer">
                    <span className="entry-end">...</span>{'}'}
                </p>
            </div>
        </button>
    )
}

Entry.propTypes = {
    isChosen: PropTypes.bool,
    isNew: PropTypes.bool,
    isDisabled: PropTypes.bool,
    entry: PropTypes.any,
    onClick: PropTypes.func.isRequired,
}

export default Entry;
