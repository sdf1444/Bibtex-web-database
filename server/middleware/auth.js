const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).send({
      ok: false,
      error: {
        reason: 'No token authorization denied',
        code: 401,
      },
    });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).send({
      ok: false,
      error: {
        reason: 'Token is not valid',
        code: 401,
      },
    });
  }
};
