export let canvas = document.getElementById("board");
export let ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.7;

let drawing = false;
let color = "black";
let size = 5;

export function setColor(c) { color = c; }
export function setSize(s) { size = s; }

export function startDraw(x, y) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
}

export function drawLine(x, y, remote = false) {
    if (!drawing && !remote) return;
    ctx.lineWidth = size;
    ctx.strokeStyle = color;
    ctx.lineTo(x, y);
    ctx.stroke();
}

export function stopDraw() {
    drawing = false;
    ctx.closePath();
}
