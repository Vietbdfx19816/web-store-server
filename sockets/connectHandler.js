module.exports.registerConnectHandler = (io, socket) => {
  socket.on('disconnect', () => {
    console.log(`socket ${socket.id} disconnected`);
  });
};
