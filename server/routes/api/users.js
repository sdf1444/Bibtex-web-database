const express = require('express');
const router = express.Router();

// Bring in the user registration function
const {
  userRegister,
  checkRole,
  userLogin,
  auth,
  serializeUser,
} = require('../../utils/Auth');

// Users registration
router.post('/register-user', auth, async (req, res) => {
  await userRegister(req.body, 'user', res);
});

// Admin registration
router.post('/register-admin', auth, async (req, res) => {
  await userRegister(req.body, 'admin', res);
});

// Users login
router.post('/login-user', auth, async (req, res) => {
  await userLogin(req.body, 'user', res);
});

// Admin login
router.post('/login-admin', auth, async (req, res) => {
  await userLogin(req.body, 'admin', res);
});

// Profile
router.get('/profile', auth, async (req, res) => {
  return res.json(serializeUser(req.user));
});

// Users protected
router.get('/user-protected', auth, checkRole(['user']), async (req, res) => {
  return res.json('Hello User');
});

// Admin protected
router.get('/admin-protected', auth, checkRole(['admin']), async (req, res) => {
  return res.json('Hello Admin');
});

module.exports = router;
