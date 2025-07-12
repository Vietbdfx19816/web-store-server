const jwt = require('jsonwebtoken');
const Session = require('../models/session');

module.exports.isAuth = (socket, next) => {
  try {
    const token = socket.request.signedCookies.jwt;

    const userData = jwt.verify(token, process.env.NODE_JWT_KEY);

    socket.user = userData;

    next();
  } catch (err) {
    socket.user = { username: 'Guest', role: 'Guest' };
    // continue with guest permission
    next();
  }
};

module.exports.getRoomID = async (socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;

  if (sessionID) {
    try {
      const session = await Session.findById(sessionID);
      if (session) {
        socket.roomId = sessionID;
        // continue with old session
        return next();
      }
    } catch (err) {
      return next();
    }
  }

  // socket.roomId not set
  next();
};
