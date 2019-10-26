import socketIO from "socket.io";

/**
 * Handle add-new-contact event and notify to receiver
 * @param {socketIO.Server} io from Socket.IO library
 */
let addNewContact = (io) => {
  io.on("connection", (socket) => {
    socket.on("add-new-contact", (data) => {
      console.log(data);
      console.log(socket.request.user);
    });
  });
};

export default addNewContact;
