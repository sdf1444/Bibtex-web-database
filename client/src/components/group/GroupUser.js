import React from 'react';
import PropTypes from 'prop-types';
import './GroupUser.css';

const GroupUser = (props) => {
  return (
    <div className="group-info-user">
      <div className="group-info-username">{props.user.name}</div>
      <button
        className={`group-info-ban ${props.isOwner ? '' : 'disabled'}`}
        onClick={(e) =>
          props.dispatch({
            type: 'ban',
            user: props.user
          })
        }
      >
        Ban
      </button>
    </div>
  );
};

GroupUser.propTypes = {
  user: PropTypes.any.isRequired,
  isOwner: PropTypes.bool,
  dispatch: PropTypes.any.isRequired
};

export default GroupUser;
