import { canvas, startDraw, drawLine, stopDraw, setColor, setSize } from "./canvas.js";

import { socket } from "./socket.js";

let isDrawing = false;


// when user presses the mouse
canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;                     
    startDraw(e.offsetX, e.offsetY);      
});

canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;               // only draw when mouse is pressed

    drawLine(e.offsetX, e.offsetY);       
    //seen on others screen
    socket.emit("draw", { x: e.offsetX, y: e.offsetY });
});

// when mouse is released 
canvas.addEventListener("mouseup", () => {
    isDrawing = false;        
    stopDraw();               
    socket.emit("stop");      
});

document.getElementById("colorPicker").addEventListener("change", (e) => {
    setColor(e.target.value);   //change brush color
});

document.getElementById("size").addEventListener("input", (e) => {
    setSize(e.target.value);    //for brush size
});

// after clicking eraser it basically sets color to white 
document.getElementById("eraser").addEventListener("click", () => {
    setColor("white");
});


// remote functions
window.remoteDraw = (x, y) => drawLine(x, y, true);
window.remoteStop = () => stopDraw();
