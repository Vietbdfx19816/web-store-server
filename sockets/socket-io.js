const { Server } = require('socket.io');

// import socket handler
const { registerRoomHandler } = require('./roomHandler');
const { registerMessageHandler } = require('./messageHandler');
const { registerConnectHandler } = require('./connectHandler');

const { isAuth, getRoomID } = require('./socket-middlewares');
const { corsOptions } = require('../middleware/cors');
const { cookieParser } = require('../middleware/cookie');

module.exports = httpServer => {
  const io = new Server(httpServer, {
    cors: corsOptions,
    cookie: true,
  });

  io.engine.use(cookieParser);
  const ioChat = io.of('/chat');

  // check user login and create socket.user
  ioChat.use(isAuth);

  // set socket.roomId when client want to reconnect old session
  ioChat.use(getRoomID);

  // register listener to io server
  ioChat.on('connection', socket => {
    console.log(`socket ${socket.id} connected`);
    registerRoomHandler(ioChat, socket);

    registerMessageHandler(ioChat, socket);

    registerConnectHandler(ioChat, socket);
  });

  // notify to room member when user join custom room
  // client save roomID to localStorage for persistent session
  ioChat.adapter.on('join-room', (room, id) => {
    // prevent notify when join default room
    if (room === id || room === 'room-list') return;

    ioChat.to(id).emit('room', { action: 'joinRoom', roomId: room });
  });
};
