export const socket = io();

socket.on("init", (data) => {
  // data: { yourId, yourLabel, yourColor, users, strokes }
  window.MY_ID = data.yourId;
  window.MY_LABEL = data.yourLabel;
  window.MY_COLOR = data.yourColor;
  window.userInfo = data.users || {};
  window.remoteCursors = {};
  window.serverStrokes = data.strokes || [];

  if (window.onInit) window.onInit(data);
});


socket.on("users", (users) => {
  window.userInfo = users || {};
  if (window.onUsersUpdated) window.onUsersUpdated(users);
});

//when we are receiver; receiving data
socket.on("draw", (data) => {
    window.remoteDraw(data);
});

socket.on("start", (data) => {
    socket.broadcast.emit("start", data);
});



// when other user stops drawing
socket.on("stop", () => {
    window.remoteStop();
});

// socket.on("cursor", (data) => {
//     remoteCursors[data.id] = {
//         x: data.x,
//         y: data.y
//     };
// });

socket.on("strokeSaved", (stroke) => {
  // main can keep a local record if desired
  if (!window.serverStrokes) window.serverStrokes = [];
  window.serverStrokes.push(stroke);
  if (window.onStrokeSaved) window.onStrokeSaved(stroke);
});

// Remote Cursor
// socket.on("cursor", (data) => {
//     if (!window.remoteCursors) window.remoteCursors = {};
//     if (!window.userInfo) window.userInfo = {};

//     // If this user is new → give them a random color + random label
//     if (!window.userInfo[data.id]) {
//         const label = String.fromCharCode(65 + Object.keys(window.userInfo).length); // A,B,C,..
//         const color = "#" + Math.floor(Math.random() * 16777215).toString(16); // random hex color

//         window.userInfo[data.id] = { label, color };
//     }

//     // Save cursor position
//     window.remoteCursors[data.id] = {
//         x: data.x,
//         y: data.y
//     };
// });


//remote cursor
socket.on("cursor", (data) => {
  if (!window.remoteCursors) window.remoteCursors = {};
  window.remoteCursors[data.id] = { x: data.x, y: data.y };
});

