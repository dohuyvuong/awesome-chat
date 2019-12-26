import socketIO from "socket.io";
import clients from "../clients";
import { UserModel, ConversationModel } from "../../models";
import { handleOnlineOffline } from "../status/handleOnlineOffline";

/**
 * Handle remove-contact event
 * @param {socketIO.Server} io from Socket.IO library
 * @param {socketIO.Socket} socket Socket
 */
let listenRemoveContact = (io, socket) => {
  socket.on("remove-contact", async ({ contactId, conversationId }) => {
    let currentUser = {
      _id: socket.request.user._id,
      username: socket.request.user.username,
      avatar: socket.request.user.avatar,
      address: socket.request.user.address ? socket.request.user.address : "",
    };

    handleOnlineOffline.emitContactOnline(io, socket);
    if (clients[contactId]) {
      clients[contactId].forEach(socketId => {
        handleOnlineOffline.emitContactOnline(io, io.sockets.connected[socketId]);
        io.sockets.connected[socketId].emit("response-remove-contact", {
          user: currentUser,
          conversationId,
        });
      });
    }
  });
};

export default listenRemoveContact;
