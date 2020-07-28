import React, { useReducer, useEffect } from 'react';
import * as utils from '../../actions/group';
import './Group.css';
import GroupList from './GroupList';
import GroupInfo from './GroupInfo';

function groupReducer(state, action) {
  switch (action.type) {
    case 'setUser': {
      return {
        ...state,
        user: action.user
      };
    }
    case 'selectType': {
      if (state.reqType === action.value) return state;
      return {
        ...state,
        reqType: action.value,
        isLoading: true,
        selectedGroup: null,
        inputName: ''
      };
    }
    case 'selectGroup': {
      const group =
        state.selectedGroup && state.selectedGroup._id === action.group._id
          ? null
          : action.group;
      const inputName = group ? group.name : '';
      return {
        ...state,
        selectedGroup: group,
        inputName
      };
    }
    case 'clickGroup': {
      return {
        ...state,
        isGroupClicked: true,
        clickedGroup: action.group
      };
    }
    case 'inputName': {
      return { ...state, inputName: action.value };
    }
    case 'clickCreate': {
      if (state.selectedGroup && state.selectedGroup.name !== state.inputName) {
        return { ...state, isSaving: true };
      }
      return { ...state, isCreating: true };
    }
    case 'reply': {
      return {
        ...state,
        isReplying: true,
        reply: action.reply,
        repliedUser: action.user
      };
    }
    case 'ban': {
      return {
        ...state,
        isBanning: true,
        bannedUser: action.user
      };
    }
    case 'finishLoading': {
      return {
        ...state,
        isLoading: false,
        groups: action.groups
      };
    }
    case 'finishClicking': {
      if (!action.ok)
        return {
          ...state,
          isGroupClicked: false,
          clickedGroup: null
        };
      return {
        ...state,
        isLoading: true,
        isGroupClicked: false,
        clickedGroup: null,
        selectedGroup: action.group
      };
    }
    case 'finishSaving': {
      if (!action.ok)
        return {
          ...state,
          isSaving: false
        };
      return {
        ...state,
        isSaving: false,
        isLoading: true
      };
    }
    case 'finishCreating': {
      if (!action.ok)
        return {
          ...state,
          isCreating: false
        };
      return {
        ...state,
        isCreating: false,
        isLoading: true,
        selectedGroup: action.group
      };
    }
    case 'finishReplying': {
      if (!action.ok)
        return {
          ...state,
          isReplying: false,
          reply: null,
          repliedUser: null
        };
      return {
        ...state,
        isReplying: false,
        isLoading: true,
        reply: null,
        repliedUser: null,
        selectedGroup: action.group
      };
    }
    case 'finishBanning': {
      if (!action.ok)
        return {
          ...state,
          isBanning: false,
          bannedUser: null
        };
      return {
        ...state,
        isLoading: true,
        isBanning: false,
        bannedUser: null,
        selectedGroup: action.group
      };
    }
    default:
      return state;
  }
}

const Group = () => {
  const initialState = {
    isLoading: true,
    groups: null,
    user: null,
    isGroupClicked: false,
    clickedGroup: null,
    selectedGroup: null,
    isBanning: false,
    bannedUser: null,
    isReplying: false,
    repliedUser: null,
    isCreating: false,
    isSaving: false,
    reply: null,
    reqType: '',
    inputName: ''
  };

  const [state, dispatch] = useReducer(groupReducer, initialState);

  useEffect(() => {
    const setUser = async () => {
      const res = await utils.getUser();
      dispatch({
        type: 'setUser',
        user: res.data
      });
    };
    setUser();
  }, []);
  useEffect(() => {
    const loadGroups = async () => {
      const res = await utils.getGroups(state.reqType);
      dispatch({
        type: 'finishLoading',
        isGroupClicked: false,
        clickedGroup: null,
        groups: res.data.response
      });
    };
    if (state.isLoading) loadGroups();
  }, [state.isLoading, state.reqType]);
  useEffect(() => {
    const saveGroup = async () => {
      const res = await utils.saveGroup(
        state.inputName,
        state.selectedGroup._id
      );
      dispatch({
        type: 'finishSaving',
        ok: res.data.ok,
        group: res.data.response
      });
    };
    if (state.isSaving) saveGroup();
  }, [state.isSaving, state.inputName, state.selectedGroup]);
  useEffect(() => {
    const createGroup = async () => {
      const res = await utils.createGroup(state.inputName);
      dispatch({
        type: 'finishCreating',
        ok: res.data.ok,
        group: res.data.response
      });
    };
    if (state.isCreating) createGroup();
  }, [state.isCreating, state.inputName]);
  useEffect(() => {
    const reply = async () => {
      if (state.reply) {
        const res = await utils.acceptMember(
          state.selectedGroup._id,
          state.repliedUser._id
        );
        return dispatch({
          type: 'finishReplying',
          ok: res.data.ok,
          group: res.data.response
        });
      } else {
        const res = await utils.rejectMember(
          state.selectedGroup._id,
          state.repliedUser._id
        );
        return dispatch({
          type: 'finishReplying',
          ok: res.data.ok,
          group: res.data.response
        });
      }
    };
    if (state.isReplying) reply();
  }, [state.isReplying, state.repliedUser, state.reply, state.selectedGroup]);
  useEffect(() => {
    const ban = async () => {
      const res = await utils.banMember(
        state.selectedGroup._id,
        state.bannedUser._id
      );
      return dispatch({
        type: 'finishBanning',
        ok: res.data.ok,
        group: res.data.response
      });
    };
    if (state.isBanning) ban();
  }, [state.isBanning, state.selectedGroup, state.bannedUser]);
  useEffect(() => {
    const interactGroup = async () => {
      if (state.reqType === '') {
        const res = await utils.joinGroup(state.clickedGroup._id);
        return dispatch({
          type: 'finishClicking',
          ok: res.data.ok,
          group: res.data.response
        });
      }
      if (state.reqType === 'own') {
        const res = await utils.deleteGroup(state.clickedGroup._id);
        return dispatch({
          type: 'finishClicking',
          ok: res.data.ok,
          group: res.data.response
        });
      }
      if (state.reqType === 'me') {
        const res = await utils.leaveGroup(state.clickedGroup._id);
        return dispatch({
          type: 'finishClicking',
          ok: res.data.ok,
          group: res.data.response
        });
      }
    };
    if (state.isGroupClicked) interactGroup();
  }, [state.isGroupClicked, state.clickedGroup, state.reqType]);

  return (
    <div className="Group">
      <GroupList
        active={!state.isLoading}
        groups={state.groups}
        selectedType={state.reqType}
        inputName={state.inputName}
        selectedGroup={state.selectedGroup}
        user={state.user}
        dispatch={dispatch}
      />
      <GroupInfo
        active={!!state.selectedGroup && !state.isLoading}
        group={state.selectedGroup}
        isOwner={state.reqType === 'own'}
        dispatch={dispatch}
      />
    </div>
  );
};

export default Group;
