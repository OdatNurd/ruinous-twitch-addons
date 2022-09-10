import "../css/addon_two.css";

let socket = io();

socket.on('chat message', (msg) => {
  console.log('message: ' + msg);
});

console.log('an overlay has been loaded');
socket.emit('chat message', 'this is a message from the overlay')