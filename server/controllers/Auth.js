const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const {
  JWT_SECRET,
  RESET_PASSWORD,
  MAILGUN_API,
  CLIENT_URL,
} = require('../../config');
const mailgun = require('mailgun-js');
const DOMAIN = 'sandbox103a429e6c324383b7d16cde2bfd129e.mailgun.org';
const mg = mailgun({ apiKey: `${MAILGUN_API}`, domain: DOMAIN });

const User = require('../models/User');

/**
 * @DESC To register the user (ADMIN, SUPER_ADMIN, USER)
 */
const userRegister = async (userDets, role, res) => {
  try {
    // Validate the username
    let usernameNotTaken = await validateUsername(userDets.username);
    if (!usernameNotTaken) {
      return res.status(400).json({
        message: `Username is already taken.`,
        success: false,
      });
    }

    // validate the email
    let emailNotRegistered = await validateEmail(userDets.email);
    if (!emailNotRegistered) {
      return res.status(400).json({
        message: `Email is already registered.`,
        success: false,
      });
    }

    // Get the hashed password
    const password = await bcrypt.hash(userDets.password, 12);
    // create a new user
    const newUser = new User({
      ...userDets,
      password,
      role,
    });

    await newUser.save();
    return res.status(201).json({
      message: 'Hurry! now you are successfully registred. Please now login.',
      success: true,
    });
  } catch (err) {
    // Implement logger function (winston)
    return res.status(500).json({
      message: 'Unable to create your account.',
      success: false,
    });
  }
};

/**
 * @DESC To Login the user (ADMIN, SUPER_ADMIN, USER)
 */
const userLogin = async (userCreds, role, res) => {
  let { username, password } = userCreds;
  // First Check if the username is in the database
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({
      message: 'Username is not found. Invalid login credentials.',
      success: false,
    });
  }
  // We will check the role
  if (user.role !== role) {
    return res.status(403).json({
      message: 'Please make sure you are logging in from the right portal.',
      success: false,
    });
  }
  // That means user is existing and trying to signin fro the right portal
  // Now check for the password
  let isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    // Sign in the token and issue it to the user
    let token = jwt.sign(
      {
        user_id: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET
    );

    let result = {
      username: user.username,
      role: user.role,
      email: user.email,
      token: `Bearer ${token}`,
      // expiresIn: 168,
    };

    return res.status(200).json({
      ...result,
      message: 'Hurray! You are now logged in.',
      success: true,
    });
  } else {
    return res.status(403).json({
      message: 'Incorrect password.',
      success: false,
    });
  }
};

const validateUsername = async (username) => {
  let user = await User.findOne({ username });
  return user ? false : true;
};

/**
 * @DESC Passport middleware
 */
const auth = passport.authenticate('jwt', { session: false });

/**
 * @DESC Check Role Middleware
 */
const checkRole = (roles) => (req, res, next) =>
  !roles.includes(req.user.role)
    ? res.status(401).json('Unauthorized')
    : next();

const validateEmail = async (email) => {
  let user = await User.findOne({ email });
  return user ? false : true;
};

/**
 * @DESC Forgot password
 */
const forgotPassword = (req, res) => {
  const { email } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res
        .status(400)
        .json({ error: 'User with this email does not exist' });
    }

    const token = jwt.sign({ _id: user._id }, `${RESET_PASSWORD}`);
    const data = {
      from: 'spencerdu@hotmail.co.uk',
      to: email,
      subject: 'Account Activation Link',
      html: `
          <h2>Please click on given link to rest your password</h2>
          <p>${`${CLIENT_URL}`}/resetpassword/${token}</p>
      `,
    };

    return user.updateOne({ resetLink: token }, function (err, success) {
      if (err) {
        return res.status(400).json({ error: 'reset password link error' });
      } else {
        mg.messages().send(data, function (error, body) {
          if (error) {
            return res.json({
              error: err.message,
            });
          }
          return res.json({
            message: 'Email has been sent, kindly follow the instructions',
          });
        });
      }
    });
  });
};

module.exports = {
  auth,
  checkRole,
  userLogin,
  userRegister,
  forgotPassword,
};
