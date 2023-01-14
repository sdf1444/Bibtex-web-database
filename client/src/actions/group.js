import axios from 'axios';

export const getUser = async () => {
  const res = await axios.get('/api/user/me');
  return res;
};

export const getGroups = async (type) => {
  const res = await axios.get(`/api/group/${type}`);
  return res;
};

export const deleteGroup = async (groupId) => {
  try {
    const res = await axios.delete(`/api/group/${groupId}`);
    return res;
  } catch (err) {
    return err.response;
  }
};

export const leaveGroup = async (groupId) => {
  try {
    const res = await axios.post(`/api/group/leave`, {
      id: groupId,
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const joinGroup = async (groupId) => {
  try {
    const res = await axios.post('/api/group/join-request', {
      id: groupId,
    });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const createGroup = async (name) => {
  try {
    const res = await axios.post('/api/group/', { name });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const saveGroup = async (name, id) => {
  try {
    const res = await axios.put('/api/group', { name, id });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const acceptMember = async (groupId, userId) => {
  try {
    const res = await axios.post('/api/group/accept', { groupId, userId });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const rejectMember = async (groupId, userId) => {
  try {
    const res = await axios.post('/api/group/decline', { groupId, userId });
    return res;
  } catch (err) {
    return err.response;
  }
};

export const banMember = async (groupId, userId) => {
  try {
    const res = await axios.post('/api/group/ban', { groupId, userId });
    return res;
  } catch (err) {
    return err.response;
  }
};
