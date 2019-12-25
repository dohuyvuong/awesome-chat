import socketIO from "socket.io";
import clients from "../clients";
import { ConversationModel } from "../../models";

/**
 * Handle add new conversation event
 * @param {socketIO.Server} io from Socket.IO library
 * @param {socketIO.Socket} socket Socket
 */
let listenAddNewConversation = (io, socket) => {
  socket.on("conversation-add-new-group", async ({ conversationId }) => {
    let currentUser = {
      _id: socket.request.user._id,
      username: socket.request.user.username,
      avatar: socket.request.user.avatar,
      address: socket.request.user.address ? socket.request.user.address : "",
    };

    let conversation = await ConversationModel.findConversationById(conversationId);
    conversation.members.forEach(member => {
      if (member.userId != currentUser._id && clients[member.userId]) {
        clients[member.userId].forEach(socketId => {
          io.sockets.connected[socketId].emit("response-conversation-add-new-group", {
            conversation,
          });
        });
      }
    });
  });
};

export default listenAddNewConversation;
