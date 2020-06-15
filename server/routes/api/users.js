const express = require('express');
const router = express.Router();

// Bring in the user registration function
const {
  userRegister,
  checkRole,
  userLogin,
  auth,
  forgotPassword,
} = require('../../controllers/Auth');

// Users registration
router.post('/register-user', async (req, res) => {
  await userRegister(req.body, 'user', res);
});

// Admin registration
router.post('/register-admin', async (req, res) => {
  await userRegister(req.body, 'admin', res);
});

// Users login
router.post('/login-user', async (req, res) => {
  await userLogin(req.body, 'user', res);
});

// Admin login
router.post('/login-admin', async (req, res) => {
  await userLogin(req.body, 'admin', res);
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const user = await User.find().populate('user');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Users protected
router.get('/user-protected', auth, checkRole(['user']), async (req, res) => {
  return res.json('Hello User');
});

// Admin protected
router.get('/admin-protected', auth, checkRole(['admin']), async (req, res) => {
  return res.json('Hello Admin');
});

// Forgot password rest
router.put('/forgot-password', forgotPassword);

module.exports = router;
