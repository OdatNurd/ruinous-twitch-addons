import "../css/addon_common.css";

import { addonId } from '$seed/addons/addon_three.js';


const overlayId = location.hash.substr(1);

if (overlayId !== '') {
  fetch(`/api/v1/overlay/${overlayId}`)
   .then(res => res.json())
   .then(payload => console.log(payload));
}

let socket = io(`/${addonId}`);

socket.on('connect', () => {
  console.log(`our connected client socket is ${socket.id}`);
  socket.emit('message', 'this is a message from an addon_three overlay');
});

socket.on('disconnect', () => {
  console.log(`our socket ${socket.id} got disconnected`);
});

socket.on('message', (msg) => {
  console.log(`message from the server: ${msg}`);
});

console.log(`The overlay for the addon whose id is ${addonId} has been loaded`);
