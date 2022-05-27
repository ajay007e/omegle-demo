const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatCord Bot";

// Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username }) => {
    const user = userJoin(socket.id, username);

    socket.join(user.room);

    // Welcome current user
    // socket.emit("info-message", formatMessage(botName, "Welcome to ChatCord!"));
    if(user.f){
      socket.emit("info-message", formatMessage(botName, "Waiting for someone to join..."));
    }
    else{
    socket.emit("info-message", formatMessage(botName, "Stranger has joined the chat"));

    }
    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "info-message",
        // formatMessage(botName, `${user.username} has joined the chat`)
        formatMessage(botName, `Stranger has joined the chat`)

      );

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg,socket.id));
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "info-message",
        // formatMessage(botName, `${user.username} has left the chat`)
        formatMessage(botName, `Stranger has left the chat`)
      );
      

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });

      setTimeout(()=>{
        io.to(user.room).emit(
          "info-message",
          // formatMessage(botName, `${user.username} has left the chat`)
          formatMessage(botName, `Waiting for someone to join...`)
        );
      },1000);
    }
  });
});
// console.log(process.env) 
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));