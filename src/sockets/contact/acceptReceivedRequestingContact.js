import socketIO from "socket.io";
import clients from "../clients";
import { UserModel, ConversationModel } from "../../models";
import { handleOnlineOffline } from "../status/handleOnlineOffline";

/**
 * Handle accept-received-requesting-contact event and notify to receiver
 * @param {socketIO.Server} io from Socket.IO library
 * @param {socketIO.Socket} socket Socket
 */
let listenAcceptReceivedRequestingContact = (io, socket) => {
  socket.on("accept-received-requesting-contact", async ({ contactId, conversationId }) => {
    let currentUser = {
      _id: socket.request.user._id,
      username: socket.request.user.username,
      avatar: socket.request.user.avatar,
      address: socket.request.user.address ? socket.request.user.address : "",
    };

    let conversation = await ConversationModel.findConversationById(conversationId);
    conversation = conversation.toObject();
    let otherUserId = conversation.members.filter(member => member.userId != contactId)[0].userId;
    let otherUser = await UserModel.findUserById(otherUserId);
    conversation.name = otherUser.username;
    conversation.avatar = otherUser.avatar;

    handleOnlineOffline.emitContactOnline(io, socket);
    if (clients[contactId]) {
      clients[contactId].forEach(socketId => {
        handleOnlineOffline.emitContactOnline(io, io.sockets.connected[socketId]);
        io.sockets.connected[socketId].emit("response-accept-received-requesting-contact", {
          user: currentUser,
          conversation,
        });
      });
    }
  });
};

export default listenAcceptReceivedRequestingContact;
