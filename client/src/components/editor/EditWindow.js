import React from 'react';
import PropTypes from 'prop-types';
import entryFields from '../../utils/entryFields';
import './EditWindow.css';

const EditWindow = (props) => {
  if (!props.active || !props.entry) {
    return <div className='EditWindow disabled'></div>;
  }
  const infoList = [];
  entryFields[props.entry.entryType].required.forEach((tag) =>
    infoList.push(
      <div className='edit-info edit-info-required' key={tag}>
        <div className='info-label' data-tag={tag}>
          <div className='info-label-tag'>{tag}:</div>
          <div className='required-div'>Required</div>
        </div>
        <textarea
          className='info-input'
          spellCheck='false'
          required
          value={props.entryChanges.entryTags[tag] || ''}
          onChange={(e) =>
            props.dispatch({
              type: 'inputTag',
              tag,
              value: e.target.value,
            })
          }
        ></textarea>
      </div>
    )
  );
  entryFields[props.entry.entryType].extra.forEach((tag) =>
    infoList.push(
      <div className='edit-info edit-info-extra' key={tag}>
        <div className='info-label' data-tag={tag}>
          {tag}:
        </div>
        <textarea
          className='info-input'
          spellCheck='false'
          value={props.entryChanges.entryTags[tag] || ''}
          onChange={(e) =>
            props.dispatch({
              type: 'inputTag',
              tag,
              value: e.target.value,
            })
          }
        ></textarea>
      </div>
    )
  );

  return (
    <div className='EditWindow'>
      <div className='edit-window-layout'></div>
      <div className='edit-window-main'>
        <form className='edit-window-form'>
          <div className='edit-window-head'>
            Editing entry: @{props.entry.entryType.toLowerCase()}
          </div>
          <div className='edit-window-body'>
            <div className='edit-info edit-window-citation' key='citationKey'>
              <div className='info-label'>
                <div className='info-label-tag'>citationKey:</div>
                <div className='required-div'>Required</div>
              </div>
              <textarea
                className='info-input'
                required
                spellCheck='false'
                value={props.entryChanges.citationKey}
                onChange={(e) =>
                  props.dispatch({
                    type: 'inputCitationKey',
                    value: e.target.value,
                  })
                }
              ></textarea>
            </div>
            {infoList}
          </div>
          <div className='edit-window-footer'>
            <button
              className='edit-cancel-btn'
              type='button'
              onClick={(e) =>
                props.dispatch({
                  type: 'closeWindow',
                })
              }
            >
              Cancel
            </button>
            <button
              className='edit-save-btn'
              type='submit'
              onClick={(e) => {
                e.preventDefault();
                props.dispatch({
                  type: 'saveEntry',
                });
              }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

EditWindow.propTypes = {
  active: PropTypes.bool,
  entry: PropTypes.object,
  entryChanges: PropTypes.any,
  dispatch: PropTypes.any.isRequired,
};

export default EditWindow;
