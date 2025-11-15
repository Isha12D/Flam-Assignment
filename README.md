# Collaborative Canvas 🎨  
A real-time collaborative drawing application built with **Express**, **Socket.IO**, and a lightweight client-side canvas engine.  
Multiple users can draw together, see each other's cursors, and use tools like brush, colors, sizes, and an eraser — all in real time.

---

## 🌐 Live Demo
Try the collaborative canvas here: https://flam-assignment-1-0jwy.onrender.com/


---

## 🚀 Features

- Live drawing shared across all connected users  
- Real-time cursor indicators for every user  
- Unique label (A, B, C...) and color assigned to each participant  
- Brush, eraser, and size control  
- Maintains clean drawing state logic for conflict-free updates  
- Modular architecture (client + server separation)

---

## 📦 Installation & Setup

Make sure Node.js (>=16) is installed.

### **1. Clone the project**
```bash
git clone https://github.com/Isha12D/Flam-Assignment
cd collaborative-canvas
```
### **2. Install dependencies**
```bash
Copy code
npm install
```
### **3. Start the server**
```bash
Copy code
npm start
```
### **4. Open the app**
Visit:
```bash
http://localhost:3000
```
---

# 🧪 Testing With Multiple Users
To observe real-time collaboration:

### **Method 1 — Multiple Browser Tabs**
1. Open the app in one tab.
2. Open a second tab at
```bash
http://localhost:3000
```

3. Draw in one tab → it appears instantly in the other.

### **Method 2 — Multiple Devices**
1. Ensure devices are on the same WiFi.
2. Replace localhost with your computer’s IP:
```bash
http://<your-local-ip>:3000
```
### **Method 3 — Incognito Mode**
1. Open normal window → User A
2. Open incognito window → User B

Each session gets:
- A unique letter ID (A, B, C, …)
- A unique cursor color

---

# 🧱 Project Structure
```bash
collaborative-canvas/
├── client/
│   ├── index.html
│   ├── style.css
│   ├── canvas.js
│   ├── socket.js
│   └── main.js
├── server/
│   ├── server.js
│   ├── rooms.js
│   └── drawing-state.js
├── package.json
└── README.md
```
---

# ⚠️ Known Limitations / Bugs
1. All users join a single default room.
2. Cursor-layer redraws might miss a frame on slow devices.
3. Stroke history is stored, but not exposed to UI yet.
4. Large drawings can affect performance
Especially when many users draw simultaneously.
5. Eraser acts like "draw transparent"
Works correctly but does not restore previous strokes (not a bug, just expected behavior).

---

# 🕒 Time Spent
Approximately 1.5 days
(including architecture planning, real-time sync logic, cursor indicators, conflict-free stroke handling, and testing across multiple screens.)

---

# 📄 License
This project is open for personal or educational use.
Modify freely based on your needs.












