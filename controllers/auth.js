const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ms = require('ms');

// request for user data in cookie
module.exports.getLogin = (req, res, next) => {
  const user = req.user;
  const expires = req.expiresIn;

  const userData = {
    _id: user._id,
    email: user.email,
    username: user.username,
    role: user.role,
  };

  res.status(200).json({ user: userData, expires });
};

module.exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('Email not found!');
      error.status = 404;
      throw error;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const error = new Error('Wrong password!');
      error.status = 400;
      throw error;
    }

    const userData = {
      _id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(userData, process.env.NODE_JWT_KEY, {
      expiresIn: '7d',
    });

    const expires = new Date(Date.now() + ms('7d'));

    res
      .status(200)
      .cookie('__session', token, {
        httpOnly: true,
        signed: true,
        sameSite: 'Strict',
        expires,
      })
      .json({ user: userData, expires });
  } catch (err) {
    next(err);
  }
};

module.exports.signUp = async (req, res, next) => {
  const { password, email, username, phoneNumber } = req.body;

  const saltRounds = 10;

  try {
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      password: hashPassword,
      username,
      phoneNumber,
    });

    await newUser.save();

    res.status(201).json({ message: 'User Created!' });
  } catch (err) {
    next(err);
  }
};

module.exports.logOut = (req, res, next) => {
  res
    .status(200)
    .clearCookie('__session', {
      httpOnly: true,
      signed: true,
      sameSite: 'Strict',
    })
    .json({ message: 'Logout!' });
};

module.exports.getAdminLogin = (req, res, next) => {
  const user = req.session.user;

  const userData = {
    _id: user._id,
    email: user.email,
    username: user.username,
    role: user.role,
  };

  const expires = req.expiresIn;

  res.status(200).json({ user: userData, expires });
};

module.exports.postAdminLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error('Authentication Failed');
      error.status = 404;
      error.data = { email: 'Email not found!' };
      throw error;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      const error = new Error('Authentication Failed');
      error.status = 401;
      error.data = { password: 'Wrong password' };
      throw error;
    }

    const authorized = user.role === 'Support' || user.role === 'Admin';
    if (!authorized) {
      const error = new Error('Authentication Failed');
      error.status = 401;
      error.data = { email: 'You are not admin' };
      throw error;
    }

    const userData = {
      _id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(userData, process.env.NODE_JWT_KEY, {
      expiresIn: '7d',
    });

    const expires = new Date(Date.now() + ms('7d'));

    res
      .status(200)
      .cookie('__session', token, {
        httpOnly: true,
        signed: true,
        sameSite: 'Strict',
        expires,
      })
      .json({ user: userData, expires });
  } catch (err) {
    next(err);
  }
};
