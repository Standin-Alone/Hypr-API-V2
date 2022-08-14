const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, { /* options */ });

io.on("connection", (socket) => {
  
  socket.on('join-room',(data)=>{
    console.warn(`room`,data);
    socket.join(data);
  })
  socket.on('message',(data)=>{
    console.warn("MESSAGE",data);
    socket.to(data.room).emit('message-from-server',data)
  })
});

module.exports = httpServer;