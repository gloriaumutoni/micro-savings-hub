'use strict';

const jwt = require('jsonwebtoken');

/**
 * Verifies the Bearer JWT in the Authorization header.
 * On success, attaches the decoded payload to req.user.
 */
module.exports = function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ status: 401, message: 'Missing or invalid token' });
  }

  const token = header.slice(7);

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ status: 401, message: 'Token expired or invalid' });
  }
};
