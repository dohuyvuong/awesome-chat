import socketIO from "socket.io";
import clients from "../clients";

/**
 * Handle accept-received-requesting-contact event and notify to receiver
 * @param {socketIO.Server} io from Socket.IO library
 * @param {socketIO.Socket} socket Socket
 */
let listenAcceptReceivedRequestingContact = (io, socket) => {
  socket.on("accept-received-requesting-contact", (data) => {
    let currentUser = {
      _id: socket.request.user._id,
      username: socket.request.user.username,
      avatar: socket.request.user.avatar,
      address: socket.request.user.address ? socket.request.user.address : "",
    };

    if (clients[data.contactId]) {
      clients[data.contactId].forEach(socketId => {
        io.sockets.connected[socketId].emit("response-accept-received-requesting-contact", currentUser);
      });
    }
  });
};

export default listenAcceptReceivedRequestingContact;
