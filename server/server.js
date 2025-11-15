const express = require("express");
const path = require("path");
//const { color, isEraser } = require("../client/canvas");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

//import {addStroke, getAllStrokes} from './drawing-state.js';
const {addStroke, getAllStrokes}  = require('./drawing-state.js');
//import rooms from './rooms.js';
const rooms = require('./rooms.js')

app.use(express.static(path.join(__dirname, "..", "client")));

let users = {};
const labelPalette = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const colorPalette = [
  "#e6194b","#3cb44b","#ffe119","#4363d8","#f58231","#911eb4",
  "#46f0f0","#f032e6","#bcf60c","#fabebe","#008080","#e6beff"
];

function assignLabelAndColor() {
  const usedLabels = Object.values(users).map(u => u.label);
  const nextLabel = labelPalette.find(l => !usedLabels.includes(l)) || ("U"+(usedLabels.length+1));
  //random color choose to resolve multi user conflict 
  const usedColors = Object.values(users).map(u => u.color);
  const nextColor = colorPalette.find(c => !usedColors.includes(c)) || colorPalette[Math.floor(Math.random() * colorPalette.length)];
  return { label: nextLabel, color: nextColor };
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const { label, color } = assignLabelAndColor();
  users[socket.id] = {
    label,
    color,
    size: 5,
    isEraser: false
  };
  rooms.addUserToRoom('default', socket.id, users[socket.id]);

  //full stroke history 
  socket.emit("init", {
    yourId: socket.id,
    yourLabel: label,
    yourColor: color,
    users: users,
    strokes: getAllStrokes()
  });


  io.emit("users", users);

  socket.on("cursor", (data) => {
    data.id = socket.id;
    socket.broadcast.emit("cursor", data);
  });

  socket.on("strokeStart", (meta) => {
    // meta: { color, size, isEraser }
    // attach meta to the socket for current stroke
    socket.currentStroke = {
      userId: socket.id,
      color: meta.color,
      size: meta.size,
      isEraser: meta.isEraser,
      points: []
    };

    socket.broadcast.emit("start", { id: socket.id, ...socket.currentStroke });
  });


  socket.on("strokeChunk", (pt) => {
    // pt = { x, y }
    if (socket.currentStroke) {
      socket.currentStroke.points.push(pt);
      // broadcast this point to others immediately
      const payload = {
        id: socket.id,
        x: pt.x,
        y: pt.y,
        color: socket.currentStroke.color,
        size: socket.currentStroke.size,
        isEraser: socket.currentStroke.isEraser
      };
      socket.broadcast.emit("draw", payload);
    }
  });

  socket.on("strokeEnd", () => {
    if (socket.currentStroke) {
      const saved = addStroke({
        id: "stroke-" + Date.now() + "-" + Math.random().toString(36).slice(2,7),
        userId: socket.id,
        color: socket.currentStroke.color,
        size: socket.currentStroke.size,
        isEraser: socket.currentStroke.isEraser,
        points: socket.currentStroke.points
      });
      // broadcast the saved stroke with sequence so everyone can persist / reorder if needed
      io.emit("strokeSaved", saved);
      socket.currentStroke = null;
    }
    socket.broadcast.emit("stop", { id: socket.id });
  });

  socket.on("stroke", (stroke) => {
    const saved = addStroke({
      id: stroke.id || ("stroke-" + Date.now()),
      userId: socket.id,
      color: stroke.color,
      size: stroke.size,
      isEraser: stroke.isEraser,
      points: stroke.points || []
    });
    io.emit("strokeSaved", saved);
  });


  socket.on("updateState", (state) => {
    users[socket.id] = { ...users[socket.id], ...state };
    io.emit("users", users);
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
    console.log("A user disconnected:", socket.id);
    delete users[socket.id];
    rooms.removeUserFromRoom('default', socket.id);
    io.emit("users", users);
  });
});

const PORT = 3000;
http.listen(PORT, () => console.log("Server running at http://localhost:" + PORT));
