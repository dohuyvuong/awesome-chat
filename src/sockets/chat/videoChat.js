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

    conversation.members.forEach(member => {
      if (member.userId != currentUser._id && clients[member.userId]) {
        clients[member.userId].forEach(async socketId => {
          if (!isOnline) {
            isOnline = true;
          }

          let receiver = await UserModel.findUserById(member.userId);
          io.sockets.connected[socketId].emit("video-call-server-request-receiver-peer-id", {
            conversation,
            caller: currentUser,
            receiver,
          });
        });
      }
    });

    if (!isOnline) {
      socket.emit("response-video-call-offline");
    }
  });

  socket.on("video-call-receiver-provide-receiver-peer-id-to-server", async ({ conversation, caller, receiver, receiverPeerId }) => {
    if (clients[caller._id]) {
      clients[caller._id].forEach(socketId => {
        io.sockets.connected[socketId].emit("video-call-server-provide-receiver-peer-id-to-caller", {
          conversation,
          caller,
          receiver,
          receiverPeerId,
        });
      });
    }
  });

  socket.on("video-call-caller-request-call-to-server", async ({ conversation, caller, receiver, receiverPeerId }) => {
    if (clients[receiver._id]) {
      clients[receiver._id].forEach(socketId => {
        io.sockets.connected[socketId].emit("video-call-server-request-call-to-receiver", {
          conversation,
          caller,
          receiver,
          receiverPeerId,
        });
      });
    }
  });

  socket.on("video-call-caller-cancel-request-call-to-server", async ({ conversation, caller, receiver, receiverPeerId }) => {
    if (clients[receiver._id]) {
      clients[receiver._id].forEach(socketId => {
        io.sockets.connected[socketId].emit("video-call-server-cancel-request-call-to-receiver", {
          conversation,
          caller,
          receiver,
          receiverPeerId,
        });
      });
    }
  });

  socket.on("video-call-receiver-reject-request-call-to-server", async ({ conversation, caller, receiver, receiverPeerId }) => {
    if (clients[caller._id]) {
      clients[caller._id].forEach(socketId => {
        io.sockets.connected[socketId].emit("video-call-server-reject-call-to-caller", {
          conversation,
          caller,
          receiver,
          receiverPeerId,
        });
      });
    }
  });

  socket.on("video-call-receiver-accept-request-call-to-server", async ({ conversation, caller, receiver, receiverPeerId }) => {
    if (clients[caller._id]) {
      clients[caller._id].forEach(socketId => {
        io.sockets.connected[socketId].emit("video-call-server-accept-call-to-caller", {
          conversation,
          caller,
          receiver,
          receiverPeerId,
        });
      });
    }
    if (clients[receiver._id]) {
      clients[receiver._id].forEach(socketId => {
        io.sockets.connected[socketId].emit("video-call-server-accept-call-to-receiver", {
          conversation,
          caller,
          receiver,
          receiverPeerId,
        });
      });
    }
  });
};

export default listenVideoCall;
