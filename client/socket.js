export const socket = io();

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
