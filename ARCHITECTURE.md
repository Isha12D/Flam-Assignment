# 🏛️ ARCHITECTURE.md — Collaborative Canvas

A deep-dive into the core architecture, real-time sync logic, WebSocket protocol, and all decisions behind the collaborative drawing system.
This document explains how the system maintains smooth, conflict-free, real-time canvas collaboration across multiple users.

# 🔄 Data Flow Diagram

Below is the high-level flow of drawing events across the system:
```bash

   ┌──────────────┐        draw_start / draw_move / draw_end
   │    User      │  ─────────────────────────────────────────►
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐     emits stroke event     ┌────────────────┐
   │   Browser    │ ──────────────────────────►│   Socket.IO     │
   │  (Canvas.js) │                              │   Server       │
   └──────────────┘     broadcast stroke        └──────┬─────────┘
                                                        │
                                                        ▼
                                              ┌─────────────────────┐
                                              │   All Connected     │
                                              │       Clients       │
                                              └─────────────────────┘
```
---

# Flow Summary

1. User draws on the canvas → UI captures mouse/touch events

2. Client normalizes and sends drawing data via WebSocket

3. Server receives event + attaches user metadata

4. Server broadcasts to all users except sender

5. Every client re-renders stroke on its own canvas

6. A shared, synchronized drawing state is maintained

---

# 📡 WebSocket Protocol

The app uses Socket.IO with a minimal and efficient real-time protocol.

### **📤 Client → Server Events**
draw:start
```bash
{
  "x": 120,
  "y": 350,
  "color": "#ff0000",
  "size": 5,
  "tool": "brush"
}
```

draw:move
```bash
{
  "x": 134,
  "y": 360
}
```

draw:end
```bash
{
  "strokeId": "abc123"
}
```

cursor:move
```bash
{
  "x": 140,
  "y": 365
}
```

undo, redo
```bash
{ "userId": "A" 
}
```

### **📥 Server → Client Events**
stroke:broadcast

Broadcast a live stroke to all clients.
```bash
{
  "userId": "A",
  "stroke": {
    "points": [...],
    "color": "#ff0000",
    "size": 5,
    "tool": "brush"
  }
}
```

cursor:update --> Sent every time another user moves their pointer.

history:sync ---> Complete canvas history sent to new users.

undo:apply / redo:apply ---> Server-applied global operations.
---

# ↩️ Undo/Redo Strategy

Undo/redo is global, not per-user.

Server Maintains a Master Stroke History
```bash
strokes = [
  { id: 1, user: "A", points:[...] },
  { id: 2, user: "B", points:[...] }
];
undoStack = [];
```

### **Undo Flow**

1. Client requests undo → socket.emit("undo")

2. Server pops the last stroke → pushes to undoStack

3. Server broadcasts undo:apply

4. Every client removes that stroke from their canvas and re-renders

### **Redo Flow**

1. Client emits redo

2. Server retrieves last undone stroke

3. Server broadcasts redo:apply

4. Clients re-render that stroke

### **Why Server Handles Undo/Redo?**

1. Keeps all clients synchronized

2. Prevents cheating/inconsistent states

3. Avoids missing strokes during fast drawing

---

# ⚡ Performance Decisions
1. Event Throttling (60 FPS cap)

`mousemove` is throttled to avoid spam and reduce useless WebSocket traffic.

2. Incremental Stroke Rendering

Clients render points as they arrive, not after the stroke is complete.

3. Server-side State Kept Lightweight

Only essential stroke metadata is stored:

- Item1 points

- Item2 color

- Item3 size

- Item4 tool

- Item5 user

No redundant canvas bitmaps stored.

4. Separate Canvas Layers

- Item1 mainLayer → actual drawing

- Item2 cursorLayer → cursors only

- Item3 livePreviewLayer → active stroke

Prevents flicker and improves clarity.

5. Binary Compression (Optional Future)

Message format designed so binary encoding can be added easily.

# ⚔️ Conflict Resolution

Multiple users drawing simultaneously is handled by:

1. Per-User Stroke Isolation

Each stroke has:

strokeId + userId


So strokes never override each other.

2. No Global Locking

Everyone can draw at the same time — no waiting.

3. Latest-Event-Wins for Live Updates

If two strokes touch the same pixel:

- Item1 Both are applied

- Item2 Order determined by event arrival

- Item3 Visually merged naturally

4. Undo Affects Global Order

Undo removes the latest stroke, even if drawn by another user.

This matches real-world collaborative tools like Figma and Miro.

# 🧠 Why This Architecture Works

- Item1 Lightweight

- Item2 Scales 20–30 concurrent users on a basic Node server

- Item3 Keeps perfect state sync

- Item4 No visual conflicts

- Item5 Smooth animations and cursor previews

- Item6 Easy to extend with rooms, pressure sensitivity, PNG export, etc.