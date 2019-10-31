import socketIO from "socket.io";
import clients from "../clients";

/**
 * Handle remove-sent-requesting-contact event and notify to receiver
 * @param {socketIO.Server} io from Socket.IO library
 * @param {socketIO.Socket} socket Socket
 */
let listenRemoveSentRequestingContact = (io, socket) => {
  socket.on("remove-sent-requesting-contact", (data) => {
    let currentUser = {
      id: socket.request.user._id,
    };

    if (clients[data.contactId]) {
      clients[data.contactId].forEach(socketId => {
        io.sockets.connected[socketId].emit("response-remove-sent-requesting-contact", currentUser);
      });
    }
  });
};

export default listenRemoveSentRequestingContact;
