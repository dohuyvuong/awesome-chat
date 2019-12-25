import listenAddNewConversation from "./addNewConversation";

/**
 * Handle conversation events
 * @param {socketIO.Server} io from Socket.IO library
 * @param {socketIO.Socket} socket Socket
 */
let listenConversationEvent = (io, socket) => {
  listenAddNewConversation(io, socket);
};

export default {
  listenConversationEvent,
};
