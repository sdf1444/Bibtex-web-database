import React from 'react';
import PropTypes from 'prop-types';
import entryFields from '../../utils/entryFields';
import './InfoList.css';

const InfoList = (props) => {
    if (!props.active || !props.entry) return <div className="info-div"></div>

    const infoList = [];
    infoList.push(
        <div className="info info-required info-citation" key="citationKey">
            <div className="info-key" data-tag="citationKey">*citationKey:</div>
            <input className="info-value" value={props.entryChanges.citationKey}
            readOnly={!props.isSelectedAllowed}
            onChange={e => props.dispatch({ 
                type: 'inputCitationKey', 
                value: e.target.value 
            })}></input>
        </div>
    )
    entryFields[props.entry.entryType].required.forEach(tag => infoList.push(
        <div className="info info-required" key={tag}>
            <div className="info-key" data-tag={tag}>*{tag}:</div>
            <input className="info-value" value={props.entryChanges.entryTags[tag] || ''}
            readOnly={!props.isSelectedAllowed} onChange={e => props.dispatch({ 
                type: 'inputTag', 
                tag, 
                value: e.target.value
            })}></input>
        </div>
    ))
    entryFields[props.entry.entryType].extra.forEach(tag => infoList.push(
        <div className="info info-required" key={tag}>
            <div className="info-key" data-tag={tag}>{tag}:</div>
            <input className="info-value" value={props.entryChanges.entryTags[tag] || ''}
            readOnly={!props.isSelectedAllowed} onChange={e => props.dispatch({ 
                type: 'inputTag', 
                tag, 
                value: e.target.value
            })}></input>
        </div>
    ))

    return (
        <div className="info-div">
            <div className="info-head">@{props.entry.entryType.toLowerCase()}</div>
            <div className="info-body">
                {infoList}
            </div>
            <div className={`info-footer ${props.isSelectedAllowed ? '' : 'disabled'}`}>
                <button className="save-btn" onClick={e => props.dispatch({
                    type: 'saveEntry',
                })}>Save</button>
                <button className="delete-btn" onClick={e => props.dispatch({
                    type: 'deleteEntry',
                })}>Delete</button>
            </div>
        </div>
    )
}

InfoList.propTypes = {
    active: PropTypes.bool.isRequired,
    entry: PropTypes.any,
    entryChanges: PropTypes.any,
    isSelectedAllowed: PropTypes.bool,
    dispatch: PropTypes.any.isRequired,
}

export default InfoList;