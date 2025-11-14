export const socket = io();

//when we are receiver; receiving data
socket.on("draw", (data) => {
    const { x, y } = data;

    window.remoteDraw(x, y);
});

// when other user stops drawing
socket.on("stop", () => {
    window.remoteStop();
});
