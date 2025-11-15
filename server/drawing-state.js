// server/drawing-state.js
// Simple in-memory store for stroke history (for demo / one-day version).
// Each stroke = { seq, id, userId, color, size, isEraser, points: [{x,y}, ...], ts }

let strokes = [];
let seq = 0;

function addStroke(stroke) {
  seq += 1;
  const withSeq = { ...stroke, seq, ts: Date.now() };
  strokes.push(withSeq);
  return withSeq;
}

function getAllStrokes() {
  // return copy
  return strokes.slice();
}

function clear() {
  strokes = [];
  seq = 0;
}

module.exports = {
  addStroke,
  getAllStrokes,
  clear
};
