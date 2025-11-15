// server/rooms.js
// Minimal room manager (single default room for now)
const rooms = {
  default: {
    users: {} // socketId -> userInfo
  }
};

function addUserToRoom(room = 'default', socketId, userInfo) {
  if (!rooms[room]) rooms[room] = { users: {} };
  rooms[room].users[socketId] = userInfo;
}

function removeUserFromRoom(room = 'default', socketId) {
  if (rooms[room]) delete rooms[room].users[socketId];
}

function getUsers(room = 'default') {
  return rooms[room] ? rooms[room].users : {};
}

module.exports = {
  addUserToRoom,
  removeUserFromRoom,
  getUsers
};
