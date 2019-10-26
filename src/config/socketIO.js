import socketIO from "socket.io";
import passportSocketIO from "passport.socketio";
import cookieParser from "cookie-parser";
import { sessionStore } from "./session";

/**
 * Config socketIO
 * @param {socketIO.Server} io from Socket.IO library
 */
let configSocketIO = (io) => {
  io.use(passportSocketIO.authorize({
    cookieParser,
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    success: (data, accept) => {
      if (!data.user.logged_in) {
        return accept(new Error("Invalid user!"));
      }

      return accept();
    },
    fail: (data, message, error, accept) => {
      if (error) {
        throw new Error(message);
      }

      return accept(new Error(message));
    }
  }));
};

export default configSocketIO;
