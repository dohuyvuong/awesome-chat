import handleOnlineOffline from "./handleOnlineOffline";

/**
 * Handle status events
 * @param {socketIO.Server} io from Socket.IO library
 * @param {socketIO.Socket} socket Socket
 */
let listenStatusEvent = (io, socket) => {
  handleOnlineOffline(io, socket);
};

export default {
  listenStatusEvent,
};
