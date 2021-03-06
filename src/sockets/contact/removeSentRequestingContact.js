import socketIO from "socket.io";
import clients from "../clients";

/**
 * Handle remove-sent-requesting-contact event
 * @param {socketIO.Server} io from Socket.IO library
 * @param {socketIO.Socket} socket Socket
 */
let listenRemoveSentRequestingContact = (io, socket) => {
  socket.on("remove-sent-requesting-contact", (data) => {
    let currentUser = {
      _id: socket.request.user._id,
      username: socket.request.user.username,
      avatar: socket.request.user.avatar,
      address: socket.request.user.address ? socket.request.user.address : "",
    };

    if (clients[data.contactId]) {
      clients[data.contactId].forEach(socketId => {
        io.sockets.connected[socketId].emit("response-remove-sent-requesting-contact", currentUser);
      });
    }
  });
};

export default listenRemoveSentRequestingContact;
