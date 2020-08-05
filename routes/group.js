const express = require('express');
const auth = require('../middleware/auth');
const Database = require('../models/Database');
const Entry = require('../models/Entry');
const User = require('../models/User');
const Group = require('../models/Group');
const { route } = require('./database');

const router = express.Router();

//@route GET api/group/
//@desc Get all groups
router.get('/', auth, async (req, res, next) => {
  const groups = await Group.find({
    $and: [{ users: { $ne: req.user.id } }, { owner: { $ne: req.user.id } }],
  })
    .populate('owner')
    .populate('users')
    .populate('joinRequests')
    .exec();
  res.data = groups;
  return next();
});

//@route GET api/group/me
//@desc Get groups user participates in
router.get('/me', auth, async (req, res, next) => {
  const groups = await Group.find({ users: req.user.id })
    .populate('owner')
    .populate('users')
    .populate('joinRequests')
    .exec();
  res.data = groups;
  return next();
});

//@route GET api/group/own
//@desc Get user's own groups
router.get('/own', auth, async (req, res, next) => {
  const groups = await Group.find({ owner: req.user.id })
    .populate('owner')
    .populate('users')
    .populate('joinRequests')
    .exec();
  res.data = groups;
  return next();
});

//@route GET api/group/withme
//@desc Get user's own groups all groups he's in
router.get('/withme', auth, async (req, res, next) => {
  const groups = await Group.find({
    $or: [{ users: req.user.id }, { owner: req.user.id }],
  })
    .populate('owner')
    .populate('users')
    .populate('joinRequests')
    .exec();
  res.data = groups;
  return next();
});

//@route POST api/group/
//@desc Create a group
router.post('/', auth, async (req, res, next) => {
  if (!req.body.name) {
    res.data = { err: 'Group name missing' };
    return next();
  }
  const group = await Group.findOne({ name: req.body.name });
  if (group) {
    res.data = { err: 'Group with this name already exists' };
    return next();
  }
  let newGroup = new Group({
    name: req.body.name,
    owner: req.user.id,
  });
  try {
    newGroup = await newGroup.save();
    res.data = newGroup;
    return next();
  } catch (err) {
    res.data = { err: err.message };
    return next();
  }
});

//@route PUT api/group/
//@desc Change group name
router.put('/', auth, async (req, res, next) => {
  if (!req.body.id) {
    res.data = { err: 'Group id missing' };
    return next();
  }
  if (!req.body.name) {
    res.data = { err: 'Group name missing' };
  }
  try {
    const group = await Group.findById(req.body.id);
    if (!group) {
      res.data = { err: 'Group with this id does not exist' };
      return next();
    }
    if (group.owner.toString() !== req.user.id.toString()) {
      res.data = { err: 'This user is not owner of this group', status: 403 };
      return next();
    }
    group.name = req.body.name;
    const newGroup = await group.save();
    res.data = newGroup;
    return next();
  } catch (err) {
    res.data = { err: err.message };
    return next();
  }
});

//@route DELETE api/group/:id
//@desc delete a group if you are an owner
//Also will delete all databases inside it
router.delete('/:id', auth, async (req, res, next) => {
  if (!req.params.id) {
    res.data = { err: 'Group id missing' };
    return next();
  }
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      res.data = { err: 'Group with this id does not exist' };
      return next();
    }
    if (group.owner.toString() !== req.user.id.toString()) {
      res.data = { err: 'This user is not owner of this group', status: 403 };
      return next();
    }
    const removedGroup = await group.remove();
    res.data = removedGroup;
    return next();
  } catch (err) {
    res.data = { err: err.message };
    return next();
  }
});

//@route POST api/group/join-request
//@desc Request to join group
router.post('/join-request', auth, async (req, res, next) => {
  if (!req.body.id) {
    res.data = { err: 'Group id missing' };
    return next();
  }
  const group = await Group.findById(req.body.id);
  if (!group) {
    res.data = { err: 'Group with this id does not exist' };
    return next();
  }
  if (group.owner.toString() === req.user.id.toString()) {
    res.data = { err: 'This user is owner' };
    return next();
  }
  if (
    group.users.map((user) => user.toString()).includes(req.user.id.toString())
  ) {
    res.data = { err: 'This user is already in a group' };
    return next();
  }
  if (
    group.joinRequests
      .map((user) => user.toString())
      .includes(req.user.id.toString())
  ) {
    res.data = { err: 'This user has already requested to join' };
    return next();
  }
  group.joinRequests.push(req.user.id);
  try {
    const newGroup = await group.save();
    res.data = newGroup;
    return next();
  } catch (err) {
    res.data = { err: err.message };
    return next();
  }
});

//@route POST api/group/leave
//@desc Leave a group
router.post('/leave', auth, async (req, res, next) => {
  if (!req.body.id) {
    res.data = { err: 'Group id missing' };
    return next();
  }
  const group = await Group.findById(req.body.id);
  if (!group) {
    res.data = { err: 'Group with this id does not exist' };
    return next();
  }
  if (group.owner.toString() === req.user.id.toString()) {
    res.data = { err: 'This user is owner' };
    return next();
  }
  if (
    !group.users.map((user) => user.toString()).includes(req.user.id.toString())
  ) {
    res.data = { err: 'This user is not in group' };
    return next();
  }
  group.users = group.users.filter((user) => {
    return user.toString() !== req.user.id.toString();
  });
  try {
    const newGroup = await group.save();
    res.data = newGroup;
    return next();
  } catch (err) {
    res.data = { err: err.message };
    return next();
  }
});

//@route POST api/group/accept
//@desc Accept join request
router.post('/accept', auth, async (req, res, next) => {
  if (!req.body.groupId) {
    res.data = { err: 'Group id missing' };
    return next();
  }
  if (!req.body.userId) {
    res.data = { err: 'User id missing' };
    return next();
  }
  const group = await Group.findById(req.body.groupId);
  if (!group) {
    res.data = { err: 'Group with this id does not exist' };
    return next();
  }
  if (group.owner.toString() !== req.user.id.toString()) {
    res.data = { err: 'This user is not an owner' };
    return next();
  }
  if (
    !group.joinRequests
      .map((user) => user.toString())
      .includes(req.body.userId.toString())
  ) {
    res.data = { err: 'This user did not send request to join' };
    return next();
  }
  group.joinRequests = group.joinRequests.filter((user) => {
    return user.toString() !== req.body.userId.toString();
  });
  group.users.push(req.body.userId);
  try {
    const newGroup = await group.save();
    res.data = await newGroup
      .populate('owner')
      .populate('users')
      .populate('joinRequests')
      .execPopulate();
    return next();
  } catch (err) {
    res.data = { err: err.message };
    return next();
  }
});

//@route POST api/group/decline
//@desc Decline user join request
router.post('/decline', auth, async (req, res, next) => {
  if (!req.body.groupId) {
    res.data = { err: 'Group id missing' };
    return next();
  }
  if (!req.body.userId) {
    res.data = { err: 'User id missing' };
    return next();
  }
  const group = await Group.findById(req.body.groupId);
  if (!group) {
    res.data = { err: 'Group with this id does not exist' };
    return next();
  }
  if (group.owner.toString() !== req.user.id.toString()) {
    res.data = { err: 'This user is not an owner' };
    return next();
  }
  if (
    !group.joinRequests
      .map((user) => user.toString())
      .includes(req.body.userId.toString())
  ) {
    res.data = { err: 'This user did not send request to join' };
    return next();
  }
  group.joinRequests = group.joinRequests.filter((user) => {
    return user.toString() !== req.body.userId.toString();
  });
  try {
    const newGroup = await group.save();
    res.data = await newGroup
      .populate('owner')
      .populate('users')
      .populate('joinRequests')
      .execPopulate();
    return next();
  } catch (err) {
    res.data = { err: err.message };
    return next();
  }
});

//@route POST api/group/ban
//@desc Ban user from group
router.post('/ban', auth, async (req, res, next) => {
  if (!req.body.groupId) {
    res.data = { err: 'Group id missing' };
    return next();
  }
  if (!req.body.userId) {
    res.data = { err: 'User id missing' };
    return next();
  }
  const group = await Group.findById(req.body.groupId);
  if (!group) {
    res.data = { err: 'Group with this id does not exist' };
    return next();
  }
  if (group.owner.toString() !== req.user.id.toString()) {
    res.data = { err: 'This user is not an owner' };
    return next();
  }
  if (
    !group.users
      .map((user) => user.toString())
      .includes(req.body.userId.toString())
  ) {
    res.data = { err: 'This user is not in group' };
    return next();
  }
  group.users = group.users.filter((user) => {
    return user.toString() !== req.body.userId.toString();
  });
  try {
    const newGroup = await group.save();
    res.data = await newGroup
      .populate('owner')
      .populate('users')
      .populate('joinRequests')
      .execPopulate();
    return next();
  } catch (err) {
    res.data = { err: err.message };
    return next();
  }
});

module.exports = router;
