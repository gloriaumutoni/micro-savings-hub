'use strict';

const { registerUser, loginUser } = require('../services/auth.service');

async function register(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 400, message: 'email and password are required' });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ status: 400, message: 'password must be at least 6 characters' });
    }

    const user = await registerUser(email, password);
    res.status(201).json({ status: 201, data: user });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ status: 409, message: 'Email already registered' });
    }
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 400, message: 'email and password are required' });
    }

    const result = await loginUser(email, password);
    res.json({ status: 200, data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
