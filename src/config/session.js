import session from "express-session";
import connectMongo from "connect-mongo";

let MongoStore = connectMongo(session);

/**
 * This variable is where save session. In this case is mongodb.
 */
let sessionStore = new MongoStore({
  url: `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  autoReconnect: true,
});

/**
 * Config session for app
 * @param app from exactly express module
 */
let configSession = (app) => {
  app.use(
    session({
      key: "express.sid",
      secret: "mySecret",
      store: sessionStore,
      resave: true,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 86400000 ms = 1 day
      },
    })
  );
};

export default configSession;
