const express = require('express');
const router = express.Router();

// Bring in the user registration function
const {
  userRegister,
  checkRole,
  userLogin,
  userAuth,
  serializeUser,
} = require('../../utils/Auth');

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

// Profile
router.get('/profile', userAuth, async (req, res) => {
  return res.json(serializeUser(req.user));
});

// Users protected
router.get(
  '/user-protected',
  userAuth,
  checkRole(['user']),
  async (req, res) => {
    return res.json('Hello User');
  }
);

// Admin protected
router.get(
  '/admin-protected',
  userAuth,
  checkRole(['admin']),
  async (req, res) => {
    return res.json('Hello Admin');
  }
);

// // @route   POST api/users
// // @desc    Register user
// // @access  Public
// router.post(
//   '/',
// [
//   check('name', 'Name is required').not().isEmpty(),
//   check('username', 'Username is required').not().isEmpty(),
//   check('email', 'Please include a valid email').isEmail(),
//   check(
//     'password',
//     'Please enter a password with 6 or more characters'
//   ).isLength({ min: 6 }),
// ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { name, username, email, password } = req.body;

//     try {
//       let user = await User.findOne({ username });

//       if (user) {
//         return res
//           .status(400)
//           .json({ errors: [{ msg: 'User already exists' }] });
//       }

//       user = new User({
//         name,
//         username,
//         email,
//         password,
//       });

//       const salt = await bcrypt.genSalt(10);

//       user.password = await bcrypt.hash(password, salt);

//       await user.save();

//       const payload = {
//         user: {
//           id: user.id,
//         },
//       };

//       jwt.sign(payload, config.get('jwtSecret'), (err, token) => {
//         if (err) throw err;
//         res.json({ token });
//       });
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send('Server error');
//     }
//   }
// );

module.exports = router;
