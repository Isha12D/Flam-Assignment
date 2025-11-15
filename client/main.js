import { canvas, ctx, startDraw, drawLine, stopDraw, setColor, setSize, isEraser, color, size, enableEraser } from "./canvas.js";
import { socket } from "./socket.js";

let isDrawing = false;

// GLOBAL shared variables
window.remoteCursors = {};   // stores {id:{x,y}}
window.userInfo = {};        // stores {id:{label,color}}

const cursorCanvas = document.getElementById("cursorLayer");
const cursorCtx = cursorCanvas.getContext("2d");

cursorCanvas.width = canvas.width;
cursorCanvas.height = canvas.height;


// ----------------------------
// ⭐ ADDED: Assign uniform label + color once per user
// ----------------------------
socket.on("assignUser", (info) => {
    window.userInfo[info.id] = info;
});


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
                   // only draw when mouse is pressed
    if (!isDrawing) {
        // Even if not drawing → send cursor
        socket.emit("cursor", {
            x: e.offsetX,
            y: e.offsetY
        });
        return;
    }

    drawLine(e.offsetX, e.offsetY);       

    socket.emit("draw", {
        x: e.offsetX,
        y: e.offsetY,
        color,
        size,
        isEraser
    });

    socket.emit("cursor", {
        x: e.offsetX,
        y: e.offsetY
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
});

document.getElementById("size").addEventListener("input", (e) => {
    setSize(e.target.value);    //for brush size
});

// after clicking eraser it basically sets color to white 
document.getElementById("eraser").addEventListener("click", () => {
    enableEraser();
});


// ----------------------------
// ❌ BUG FIX: You had TWO remoteDraw declarations (last one overwrote first one)
// ✔ We keep only ONE correct version
// ----------------------------
window.remoteDraw = (data) => {
    drawLine(data.x, data.y, true, {
        color: data.color,
        size: data.size,
        isEraser: data.isEraser
    });
};

window.remoteStop = () => stopDraw();


// ----------------------------
// ⭐ Conflict Resolution: Allow overlapping multi-user strokes without corruption
//    (Each stroke is isolated using beginPath())
// ----------------------------
socket.on("start", (data) => {
    ctx.beginPath();
});


// ----------------------------
// ⭐ Remote cursor rendering
// ----------------------------
function drawRemoteCursors() {
    cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

    Object.keys(remoteCursors).forEach((id, index) => {
        const c = remoteCursors[id];
        const user = window.userInfo[id];

        // dot
        cursorCtx.beginPath();
        cursorCtx.arc(c.x, c.y, 6, 0, Math.PI * 2);
        cursorCtx.fillStyle = user?.color || "red";
        cursorCtx.fill();

        // label
        cursorCtx.font = "14px Arial";
        cursorCtx.fillStyle = "black";
        cursorCtx.fillText(
            user?.label || String.fromCharCode(65 + index),  
            c.x + 10,
            c.y - 10
        );
    });

    requestAnimationFrame(drawRemoteCursors);
}

drawRemoteCursors();
