import socketIO from "socket.io";
import clients from "../clients";

/**
 * Handle add-new-contact event and notify to receiver
 * @param {socketIO.Server} io from Socket.IO library
 * @param {socketIO.Socket} socket Socket
 */
let listenAddNewContact = (io, socket) => {
  socket.on("add-new-contact", (data) => {
    let currentUser = {
      id: socket.request.user._id,
      username: socket.request.user.username,
      address: socket.request.user.address,
      avatar: socket.request.user.avatar ? socket.request.user.avatar : "",
    };

    if (clients[data.contactId]) {
      clients[data.contactId].forEach(socketId => {
        io.sockets.connected[socketId].emit("response-add-new-contact", currentUser);
      });
    }
  });
};

export default listenAddNewContact;
