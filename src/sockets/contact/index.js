import listenAddNewContact from "./addNewContact";
import listenRemoveSentRequestingContact from "./removeSentRequestingContact";
import listenRejectReceivedRequestingContact from "./rejectReceivedRequestingContact"
import listenAcceptReceivedRequestingContact from "./acceptReceivedRequestingContact";

/**
 * Handle all contact events
 * @param {socketIO.Server} io from Socket.IO library
 * @param {socketIO.Socket} socket Socket
 */
let listenContactEvent = (io, socket) => {
  listenAddNewContact(io, socket);
  listenRemoveSentRequestingContact(io, socket);
  listenRejectReceivedRequestingContact(io, socket);
  listenAcceptReceivedRequestingContact(io, socket);
};

export default {
  listenContactEvent
};
