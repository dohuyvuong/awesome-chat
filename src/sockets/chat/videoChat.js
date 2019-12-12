import socketIO from "socket.io";
import clients from "../clients";
import { ConversationModel, UserModel } from "../../models";

/**
 * Handle video call events
 * @param {socketIO.Server} io from Socket.IO library
 * @param {socketIO.Socket} socket Socket
 */
let listenVideoCall = (io, socket) => {
  socket.on("video-call-check-online", async ({ conversationId }) => {
    let currentUser = {
      _id: socket.request.user._id,
      username: socket.request.user.username,
      avatar: socket.request.user.avatar,
      address: socket.request.user.address ? socket.request.user.address : "",
    };

    let conversation = await ConversationModel.findConversationById(conversationId);
    let isOnline = false;

    for (let i = 0; i < conversation.members.length; i++) {
      const member = conversation.members[i];

      if (member.userId != currentUser._id && clients[member.userId]) {
        for (let j = 0; j < clients[member.userId].length; j++) {
          const socketId = clients[member.userId][j];

          let receiver = await UserModel.findUserById(member.userId);

          if (!isOnline) {
            isOnline = true;
            socket.emit("video-call-server-response-request-call-to-caller", {
              conversation,
              caller: currentUser,
              receiver,
            });
          }

          io.sockets.connected[socketId].emit("video-call-server-request-call-to-receiver", {
            callerSocketId: socket.id,
            conversation,
            caller: currentUser,
            receiver,
          });
        }
      }
    }

    if (!isOnline) {
      socket.emit("response-video-call-offline");
    }
  });

  socket.on("video-call-caller-cancel-request-call-to-server", async ({ conversation, caller, receiver }) => {
    if (clients[receiver._id]) {
      clients[receiver._id].forEach(socketId => {
        io.sockets.connected[socketId].emit("video-call-server-cancel-request-call-to-receiver");
      });
    }
  });

  socket.on("video-call-receiver-reject-request-call-to-server", async ({ callerSocketId, conversation, caller, receiver }) => {
    if (io.sockets.connected[callerSocketId]) {
      io.sockets.connected[callerSocketId].emit("video-call-server-reject-call-to-caller", {
        conversation,
        caller,
        receiver,
      });
    }

    if (clients[receiver._id]) {
      clients[receiver._id].forEach(socketId => {
        io.sockets.connected[socketId].emit("video-call-server-reject-call-to-receiver");
      });
    }
  });

  socket.on("video-call-receiver-accept-request-call-to-server", async ({ callerSocketId, conversation, caller, receiver, receiverPeerId }) => {
    if (io.sockets.connected[callerSocketId]) {
      io.sockets.connected[callerSocketId].emit("video-call-server-accept-call-to-caller", {
        conversation,
        caller,
        receiver,
        receiverPeerId,
      });
    }

    if (clients[receiver._id]) {
      clients[receiver._id].forEach(socketId => {
        io.sockets.connected[socketId].emit("video-call-server-accept-call-to-receiver");
      });
    }
  });
};

export default listenVideoCall;
