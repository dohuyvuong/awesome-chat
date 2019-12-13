import socketIO from "socket.io";
import clients from "./clients";
import contactListener from "./contact";
import chatListener from "./chat";
import statusListener from "./status";
import { handleOnlineOffline } from "./status/handleOnlineOffline";

/**
 * Init sockets
 * @param {socketIO.Server} io from Socket.IO library
 */
let initSockets = (io) => {
  io.on("connection", (socket) => {
    let currentUserId = socket.request.user._id;

    // Update clients
    if (clients[currentUserId]) {
      clients[currentUserId].push(socket.id);
    } else {
      clients[currentUserId] = [ socket.id ];
      handleOnlineOffline.emitContactOnline(io, socket);
    }

    // Handle client disconnects
    socket.on("disconnect", () => {
      clients[currentUserId] = clients[currentUserId].filter(socketId => socketId !== socket.id);

      if (!clients[currentUserId].length) {
        delete clients[currentUserId];
        handleOnlineOffline.emitContactOffline(io, socket);
      }
    });

    // Handle all events
    contactListener.listenContactEvent(io, socket);
    chatListener.listenChatEvent(io, socket);
    statusListener.listenStatusEvent(io, socket);
  });
};

export default initSockets;
