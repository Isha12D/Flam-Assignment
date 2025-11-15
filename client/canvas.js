export let canvas = document.getElementById("board");
export let ctx = canvas.getContext("2d");

//adding global vars to ensure same attributes in both screens
export let color = "black";
export let size = 5;
export let isEraser = false;

export let drawing = false;


canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.7;


export function setColor(c) { 
    color = c; 
    isEraser = false; 
}

export function setSize(s) {
    size = s;
}

export function enableEraser() { 
    isEraser = true;
}


export function startDraw(x, y) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
}

export function drawLine(x, y, remote = false, remoteState = null) {

    let currentColor = color;
    let currentSize = size;
    let currentEraser = isEraser;

    // If it's a remote draw → use sender's settings
    if (remoteState) {
        currentColor = remoteState.color;
        currentSize = remoteState.size;
        currentEraser = remoteState.isEraser;
    }

    // Apply brush or eraser behavior
    if (currentEraser) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = currentSize;
    } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentSize;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
}

export function remoteStart(state) {
    ctx.beginPath();
    ctx.moveTo(state.x, state.y);

    if (state.isEraser) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = state.size;
    } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = state.color;
        ctx.lineWidth = state.size;
    }
}



export function stopDraw() {
    drawing = false;
    ctx.closePath();
}
