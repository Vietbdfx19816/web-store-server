const Session = require('../models/session');
// const socketIo = require('./socket-io');

module.exports.registerMessageHandler = (io, socket) => {
  const username = socket.user.username;
  const role = socket.user.role;

  socket.on('message', async payload => {
    // socket not send any message

    if (!payload?.message) return;

    // create new room and join that room
    // socket not join any room beside the default room
    const createNewRoom = socket.rooms.size === 1;

    if (createNewRoom) {
      try {
        const session = new Session({
          messages: [
            {
              username,
              role,
              message: payload.message,
            },
          ],
        });

        const room = await session.save();

        // room id = session id
        socket.join(room._id.toString());
        socket.roomId = room._id.toString();

        // notify new room is created
        io.to('room-list').emit('room', {
          action: 'newRoom',
          roomId: room._id,
        });

        return;
      } catch (err) {
        return;
      }
    }

    // checking socket had joined room, can not send or read message if false
    const roomId = socket?.roomId;
    const validRoomId = roomId && socket.rooms.has(roomId);

    if (!validRoomId) return;

    // delete room with message '/end'
    const deleteRoom = validRoomId && payload.message.trim() === '/end';

    if (deleteRoom) {
      try {
        await Session.deleteOne({ _id: roomId });
        io.to(roomId).emit('room', { action: 'leaveRoom', roomId });
        io.to('room-list').emit('room', { action: 'deleteRoom', roomId });
        io.socketsLeave(roomId);
        return;
      } catch (error) {
        return;
      }
    }

    // search room in database and store message to that session
    try {
      const room = await Session.findById(roomId);
      const message = room.messages.create({
        username,
        role,
        message: payload.message,
        createAt: Date.now(),
      });

      room.messages.push({ $each: [message], $position: 0 });

      await room.save();

      io.to(roomId).emit('newMessage', message._doc);

      return;
    } catch (err) {
      return;
    }
  });

  socket.on('loadMessages', async payload => {
    // checking socket had joined room, can not send or read message if false
    const roomId = socket?.roomId;
    const validRoomId = roomId && socket.rooms.has(roomId);

    if (!validRoomId) return;

    try {
      const currentSession = await Session.findById(roomId)
        .lean()
        .select('messages');

      const messages = currentSession.messages;

      socket.emit('loadMessages', messages);
      return;
    } catch (err) {
      return;
    }
  });
};
