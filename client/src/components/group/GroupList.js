import React from 'react';
import PropTypes from 'prop-types';
import './GroupList.css';
import GroupBox from './GroupBox';

const GroupList = (props) => {
  if (!props.active) return <div className='group-list'></div>;
  return (
    <div className='group-list'>
      <div className='group-head'>
        <button
          className={`group-all ${props.selectedType === '' ? 'clicked' : ''}`}
          onClick={(e) => props.dispatch({ type: 'selectType', value: '' })}
        >
          All
        </button>
        <button
          className={`group-own ${
            props.selectedType === 'own' ? 'clicked' : ''
          }`}
          onClick={(e) => props.dispatch({ type: 'selectType', value: 'own' })}
        >
          Own
        </button>
        <button
          className={`group-withme ${
            props.selectedType === 'me' ? 'clicked' : ''
          }`}
          onClick={(e) => props.dispatch({ type: 'selectType', value: 'me' })}
        >
          With me
        </button>
      </div>
      <div className='group-body'>
        {props.groups.map((group) => (
          <GroupBox
            key={group._id}
            isSelected={
              props.selectedGroup && group._id === props.selectedGroup._id
            }
            group={group}
            groupType={props.selectedType}
            user={props.user}
            dispatch={props.dispatch}
          />
        ))}
      </div>
      <div
        className={`group-footer ${
          props.selectedType === 'own' ? '' : 'disabled'
        }`}
      >
        <div className='input-group-label'>Enter group name</div>
        <input
          className='input-group-name'
          value={props.inputName}
          onChange={(e) =>
            props.dispatch({
              type: 'inputName',
              value: e.target.value,
            })
          }
        ></input>
        <button
          className='group-create-btn'
          onClick={(e) =>
            props.dispatch({
              type: 'clickCreate',
            })
          }
        >
          {props.selectedGroup ? 'Save' : 'Create'}
        </button>
      </div>
    </div>
  );
};

GroupList.propTypes = {
  active: PropTypes.bool,
  groups: PropTypes.array,
  selectedType: PropTypes.string,
  selectedGroup: PropTypes.any,
  inputName: PropTypes.string.isRequired,
  user: PropTypes.any,
  dispatch: PropTypes.any.isRequired,
};

export default GroupList;
