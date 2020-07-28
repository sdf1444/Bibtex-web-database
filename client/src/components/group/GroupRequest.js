import React from 'react';
import PropTypes from 'prop-types';
import './GroupRequest.css';

const GroupRequest = (props) => {
  return (
    <div className="group-info-req">
      <div className="group-info-req-name">{props.user.username}</div>
      <div className="group-info-req-buttons">
        <button
          className="group-info-accept box-safe"
          onClick={(e) =>
            props.dispatch({
              type: 'reply',
              reply: true,
              user: props.user
            })
          }
        >
          Accept
        </button>
        <button
          className="group-info-reject box-dang"
          onClick={(e) =>
            props.dispatch({
              type: 'reply',
              reply: false,
              user: props.user
            })
          }
        >
          Reject
        </button>
      </div>
    </div>
  );
};

GroupRequest.propTypes = {
  user: PropTypes.any.isRequired,
  dispatch: PropTypes.any.isRequired
};

export default GroupRequest;
