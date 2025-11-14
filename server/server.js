const express = require("express");
const path = require("path");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

app.use(express.static(path.join(__dirname, "..", "client")));

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // When someone draws
  socket.on("draw", (data) => {
    socket.broadcast.emit("draw", data);  // send to all except sender
  });

  // When someone stops drawing
  socket.on("stop", () => {
    socket.broadcast.emit("stop");
  });
});

const PORT = 3000;
http.listen(PORT, () => console.log("Server running at http://localhost:" + PORT));
