import React from 'react';
import PropTypes from 'prop-types';
import GroupUser from './GroupUser';
import GroupRequest from './GroupRequest';
import './GroupInfo.css';

const GroupInfo = (props) => {
    if (!props.active) return (
        <div className="group-info"></div>
    )
    const users = props.group.users.map(user => <GroupUser 
        key={user._id + 'user'}
        user={user} isOwner={props.isOwner} dispatch={props.dispatch}/>
    )
    const requests = props.isOwner ? props.group.joinRequests.map(user => <GroupRequest 
        key={user._id + 'req'}
        user={user} dispatch={props.dispatch}/>) : null;
    console.log(props.group);
    return (
        <div className="group-info">
            <div className={`group-info-users ${props.isOwner ? '' : 'full-height'}`}>
                {users}
            </div>
            <div className={`group-info-requests ${props.isOwner ? '' : 'disabled'}`}>
                {requests}
            </div>
        </div>
    )
}

GroupInfo.propTypes = {
    active: PropTypes.bool,
    group: PropTypes.any,
    isOwner: PropTypes.bool,
    dispatch: PropTypes.any.isRequired,
}

export default GroupInfo;
