const express = require("express");
const path = require("path");
//const { color, isEraser } = require("../client/canvas");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

app.use(express.static(path.join(__dirname, "..", "client")));

let users = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  users[socket.id] = {
    color: "black",
    size: 5,
    isEraser: false
  };

  socket.on("updateState", state => {
    users[socket.id] = state;
  });

  // When someone draws
  socket.on("draw", (data) => {
    io.emit("draw", data);  // send to all except sender
  });

  

  

  // When someone stops drawing
  socket.on("stop", () => {
    socket.broadcast.emit("stop");
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
  })
});

const PORT = 3000;
http.listen(PORT, () => console.log("Server running at http://localhost:" + PORT));
