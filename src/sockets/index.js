import socketIO from "socket.io";
import addNewContact from "./contact/addNewContact";

/**
 * Handle add-new-contact event and notify to receiver
 * @param {socketIO.Server} io from Socket.IO library
 */
let initSockets = (io) => {
  addNewContact(io);
};

export default initSockets;
