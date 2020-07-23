import React from 'react';
import PropTypes from 'prop-types';
import './GroupBox.css';

const GroupBox = (props) => {
  let btnName;
  let btnClass;
  let isRequested = false;
  switch (props.groupType) {
    case '': {
      for (const user of props.group.joinRequests) {
        if (user._id === props.user._id) {
          isRequested = true;
        }
      }
      btnName = isRequested ? 'Requested to join' : 'Join';
      btnClass = 'box-click-btn box-safe';
      break;
    }
    case 'own': {
      btnName = 'Delete';
      btnClass = 'box-click-btn box-dang';
      break;
    }
    case 'me': {
      btnName = 'Leave';
      btnClass = 'box-click-btn box-dang';
      break;
    }
    default:
      break;
  }
  return (
    <div
      className={`group-box ${props.isSelected ? 'selected-group' : ''}`}
      onClick={(e) => {
        if (!e.target.classList.contains('box-click-btn'))
          props.dispatch({
            type: 'selectGroup',
            group: props.group,
          });
      }}
    >
      <div className='box-header'>
        <div className='box-name'>{props.group.name}</div>
      </div>
      <div className='box-body'>
        <div className='box-owner'>
          <div className='box-owner-label'>Owner:</div>
          <div className='box-owner-name'>{props.group.owner.username}</div>
        </div>
        <div className='box-members'>
          <div className='box-members-label'>Members:</div>
          <div className='box-members-name'>{props.group.users.length + 1}</div>
        </div>
      </div>
      <button
        className={btnClass}
        onClick={(e) => {
          if (!isRequested)
            props.dispatch({
              type: 'clickGroup',
              group: props.group,
            });
        }}
      >
        {btnName}
      </button>
    </div>
  );
};

GroupBox.propTypes = {
  group: PropTypes.any.isRequired,
  isSelected: PropTypes.bool,
  groupType: PropTypes.string.isRequired,
  user: PropTypes.any,
  dispatch: PropTypes.any.isRequired,
};

export default GroupBox;
