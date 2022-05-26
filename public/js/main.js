const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const form = document.getElementById("form");
const chat = document.querySelector(".chat-container");
const join = document.querySelector(".join-container");

const socket = io();

// Get username and room from URL
form.addEventListener("submit", (e) => {
  join.classList.toggle("hidden");
  chat.classList.toggle("hidden");
  e.preventDefault();
  const username = e.target.username.value;
  chatForm.msg.focus();
  

  // Join chatroom
  socket.emit("joinRoom", { username });
});

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on("message", (message) => {
  // console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
// ----------------------------------------------------------------------------------------------------------------------------------------------
socket.on("info-message", (message) => {
  // console.log(message);
  outputMessage(message,2);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});
//--------------------------------------------------------------------------------------------------------------------------------------------
// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit("chatMessage", msg);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message,type=1) {
  const div = document.createElement("div");
  div.classList.add("message");
  if(type==1){
    if(socket.id === message.id){
      div.classList.add("left");
    }
    const p = document.createElement("p");
  p.classList.add("meta");
  p.innerText = message.username;
  p.innerHTML += `<span>  ${message.time}</span>`;
  div.appendChild(p); 
  }else{
    div.classList.add("center");
  }
  
  const para = document.createElement("p");
  para.classList.add("text");
  para.innerText = message.text;
  div.appendChild(para);
  // document.querySelector(".chat-messages").appendChild(div);
  document.querySelector(".chat-messages").prepend(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById("leave-btn").addEventListener("click", () => {
  const leaveRoom = confirm("Are you sure you want to leave the chatroom?");
  if (leaveRoom) {
    window.location = "../";
  } else {
  }
});

// -------------------------------------------
