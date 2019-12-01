import listenChatMessageText from "./addNewMessageText";
import listenChatMessageImage from "./addNewMessageImage";
import listenChatMessageAttachment from "./addNewMessageAttachment";

/**
 * Handle all message events
 * @param {socketIO.Server} io from Socket.IO library
 * @param {socketIO.Socket} socket Socket
 */
let listenChatEvent = (io, socket) => {
  listenChatMessageText(io, socket);
  listenChatMessageImage(io, socket);
  listenChatMessageAttachment(io, socket);
};

export default {
  listenChatEvent,
};
