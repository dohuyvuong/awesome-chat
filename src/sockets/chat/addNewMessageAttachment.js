import socketIO from "socket.io";
import clients from "../clients";
import { ConversationModel } from "../../models";

/**
 * Handle chat-message-attachment event
 * @param {socketIO.Server} io from Socket.IO library
 * @param {socketIO.Socket} socket Socket
 */
let listenChatMessageAttachment = (io, socket) => {
  socket.on("chat-message-attachment", async (data) => {
    let currentUser = {
      _id: socket.request.user._id,
      username: socket.request.user.username,
      avatar: socket.request.user.avatar,
      address: socket.request.user.address ? socket.request.user.address : "",
    };

    let conversation = await ConversationModel.findConversationById(data.conversationId);
    conversation.members.forEach(member => {
      if (member.userId != currentUser._id && clients[member.userId]) {
        clients[member.userId].forEach(socketId => {
          io.sockets.connected[socketId].emit("response-chat-message-attachment", {
            conversation,
            sender: currentUser,
            message: data.message,
          });
        });
      }
    });
  });
};

export default listenChatMessageAttachment;
