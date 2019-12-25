import socketIO from "socket.io";
import clients from "../clients";
import { contactService } from "../../services";
import { ConversationModel } from "../../models";

/**
 * Handle remove-contact event
 * @param {socketIO.Server} io from Socket.IO library
 * @param {socketIO.Socket} socket Socket
 */
let handleGetOnline = (io, socket) => {
  socket.on("get-conversations-online", async () => {
    let currentUser = {
      _id: socket.request.user._id,
      username: socket.request.user.username,
      avatar: socket.request.user.avatar,
      address: socket.request.user.address ? socket.request.user.address : "",
    };

    let contactsAsUsers = await contactService.getContactsAsUsers(currentUser._id, 0, 0);
    let onlineUserIds = contactsAsUsers.filter(user => clients[user._id]).map(user => user._id);

    let conversationIds = [];
    await Promise.all(onlineUserIds.map(async userId => {
      let conversation = await ConversationModel.getConversation([currentUser._id.toString(), userId.toString()]);
      if (conversation) {
        conversationIds.push(conversation._id);
      }
    }));

    if (clients[currentUser._id]) {
      clients[currentUser._id].forEach(socketId => {
        io.sockets.connected[socketId].emit("response-conversations-online", { conversationIds });
      });
    }
  });
};

let emitContactOnline = async (io, socket) => {
  let currentUserId = socket.request.user._id.toString();

  let contactsAsUsers = await contactService.getContactsAsUsers(currentUserId, 0, 0);
  let uerIds = contactsAsUsers.filter(user => clients[user._id]).map(user => user._id);

  // Handle Online
  uerIds.forEach(userId => {
    clients[userId].forEach(async socketId => {
      let conversation = await ConversationModel.getConversation([currentUserId, userId.toString()]);
      if (conversation) {
        io.sockets.connected[socketId].emit("contact-online", { conversationId: conversation._id });
      }
    });
  });
};

let emitContactOffline = async (io, socket) => {
  let currentUserId = socket.request.user._id;

  let contactsAsUsers = await contactService.getContactsAsUsers(currentUserId, 0, 0);
  let userIds = contactsAsUsers.filter(user => clients[user._id]).map(user => user._id);

  // Handle Online
  userIds.forEach(userId => {
    clients[userId].forEach(async socketId => {
      let conversation = await ConversationModel.getConversation([currentUserId, userId.toString()]);
      if (conversation) {
        io.sockets.connected[socketId].emit("contact-offline", { conversationId: conversation._id });
      }
    });
  });
};

export default handleGetOnline;
export const handleOnlineOffline = {
  emitContactOnline,
  emitContactOffline,
};
