import socketIO from "socket.io";
import clients from "../clients";

/**
 * Handle reject-received-requesting-contact event
 * @param {socketIO.Server} io from Socket.IO library
 * @param {socketIO.Socket} socket Socket
 */
let listenRejectReceivedRequestingContact = (io, socket) => {
  socket.on("reject-received-requesting-contact", (data) => {
    let currentUser = {
      id: socket.request.user._id,
      username: socket.request.user.username,
      avatar: socket.request.user.avatar,
      address: socket.request.user.address ? socket.request.user.address : "",
    };

    if (clients[data.contactId]) {
      clients[data.contactId].forEach(socketId => {
        io.sockets.connected[socketId].emit("response-reject-received-requesting-contact", currentUser);
      });
    }
  });
};

export default listenRejectReceivedRequestingContact;
