const users = [];
const rooms = [];
const activeRooms = [];

// Join user to chat
function userJoin(id, username) {
  var room;
  if (rooms.length === 0) {
    room = randomRoom();
    while (activeRooms.includes(room)) {
      room = randomRoom();
    }
    rooms.push(room);
  } else {
    room = rooms.shift();
    activeRooms.push(room);
    // console.log(activeRooms);
  }
  const user = { id, username, room };

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    if (!rooms.includes(users[index].room)) {
      rooms.push(users[index].room);
    } else {
      rooms.pop(users[index].room);
      const j = rooms.indexOf(users[index].room);
      if (j > -1) {
        rooms.splice(j, 1);
      }
    }

    const i = activeRooms.indexOf(users[index].room);
    if (i > -1) {
      activeRooms.splice(i, 1);
    }
    console.log(rooms);
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};

// create random room number
function randomRoom() {
  return Math.floor(Math.random() * 1000);
}
