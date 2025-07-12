const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports.isAuth = async (req, res, next) => {
  try {
    const token = req.signedCookies.jwt;
    if (!token) {
      const error = new Error('Not login!');
      throw error;
    }

    const userData = jwt.verify(token, process.env.NODE_JWT_KEY);
    const expiresIn = userData.exp * 1000; // jwt exp in seconds

    const user = await User.findById(userData._id);
    if (!user) {
      const error = new Error('User not found!');
      throw error;
    }

    req.user = user;
    req.expiresIn = expiresIn;
    next();
  } catch (error) {
    error.status = 401;
    next(error);
  }
};

module.exports.isSupport = (req, res, next) => {
  const user = req.user;

  const authorized = user.role === 'Support' || user.role === 'Admin';
  if (!authorized) {
    return res.status(403).json({ message: 'Forbidden!' });
  }

  next();
};

module.exports.isAdmin = async (req, res, next) => {
  const user = req.user;

  const authorized = user.role === 'Admin';
  if (!authorized) {
    return res.status(403).json({ message: 'Forbidden!' });
  }

  next();
};
