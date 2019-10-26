import listenAddNewContact from "./addNewContact";
import listenRemoveRequestingContact from "./removeRequestingContact";

/**
 * Handle all contact events
 * @param {socketIO.Server} io from Socket.IO library
 * @param {socketIO.Socket} socket Socket
 */
let listenContactEvent = (io, socket) => {
  listenAddNewContact(io, socket);
  listenRemoveRequestingContact(io, socket);
};

export default {
  listenContactEvent
};
