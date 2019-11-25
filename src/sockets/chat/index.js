import listenChatMessageText from "./addNewMessageText";

/**
 * Handle all message events
 * @param {socketIO.Server} io from Socket.IO library
 * @param {socketIO.Socket} socket Socket
 */
let listenChatEvent = (io, socket) => {
  listenChatMessageText(io, socket);
};

export default {
  listenChatEvent,
};
