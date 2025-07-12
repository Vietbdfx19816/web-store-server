const Session = require('../models/session');
module.exports.registerRoomHandler = (io, socket) => {
  const user = socket.user;
  const authorized =
    user && (user?.role === 'Support' || user?.role === 'Admin');

  // connect to roomId if provided
  // if no roomId send message create new room
  if (socket?.roomId) {
    socket.join(socket.roomId);

    // notify admin when user join room
    io.to('room-list').emit('room', {
      action: 'newRoom',
      roomId: socket.roomId,
    });
  }

  // join room function for admin
  if (authorized) {
    socket.join('room-list'); //join room getting notification of "new room" or "room deleted"
    // console.log(socket.rooms);
    // listener to room event
    socket.on('room', async payload => {
      if (!payload?.action) return;

      // load rooms list
      if (payload.action === 'roomList') {
        const roomList = (await Session.find()).map(item =>
          item._id.toString()
        );

        return socket.emit('room', { action: 'roomList', roomList });
      }

      if (!payload?.roomId) return;

      // join room
      if (payload.action === 'joinRoom') {
        socket.roomId = payload.roomId;
        return socket.join(payload.roomId);
      }

      // leave room
      if (payload.action === 'leaveRoom') {
        socket.roomId = null;
        return socket.leave(payload.roomId);
      }
    });
  }
};
