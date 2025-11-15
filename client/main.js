import { canvas, ctx, startDraw, drawLine, stopDraw, setColor, setSize, isEraser, color, size, enableEraser } from "./canvas.js";

import { socket } from "./socket.js";

let isDrawing = false;


// when user presses the mouse
canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;                     
    startDraw(e.offsetX, e.offsetY); 
    
    socket.emit("start", {
        x: e.offsetX,
        y:e.offsetY,
        color,
        size,
        isEraser
    });
});

canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;               // only draw when mouse is pressed
    ctx.strokeStyle = isEraser ? "white" : color;
    ctx.lineWidth = size;
    drawLine(e.offsetX, e.offsetY);       
    //seen on others screen
    // socket.emit("draw", { x: e.offsetX, y: e.offsetY });
    socket.emit("draw", {
        x: e.offsetX,
        y: e.offsetY,
        color,
        size,
        isEraser
    });

});

// when mouse is released 
canvas.addEventListener("mouseup", () => {
    isDrawing = false;        
    stopDraw();               
    socket.emit("stop");      
});

document.getElementById("colorPicker").addEventListener("change", (e) => {
    setColor(e.target.value);   //change brush color
    //socket.emit("updatedState", {color, size, isEraser});
});

// document.getElementById("brush").addEventListener("click", () => {
//     isEraser = false;
// });


document.getElementById("size").addEventListener("input", (e) => {
    setSize(e.target.value);    //for brush size
    //socket.emit("updateState", {color, size, isEraser});
});

// after clicking eraser it basically sets color to white 
document.getElementById("eraser").addEventListener("click", () => {
    enableEraser();
    //socket.emit("updateState", {color, size, isEraser});
});



// remote functions
window.remoteDraw = (data) => {
    drawLine(data.x, data.y, true, {
        color: data.color,
        size: data.size,
        isEraser: data.isEraser
    });
};

window.remoteDraw = (data) => {
    drawLine(data.x, data.y, true, data);
};



window.remoteStop = () => stopDraw();
