import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyParser from "body-parser";
import connectFlash from "connect-flash";
import configSession from "./config/session";
import passport from "passport";
import { FacebookPassport, GooglePassport, LocalPassport } from "./config/passport";

// Init app
let app = express();

// Connect to MongoDB
connectDB();

// Config session
configSession(app);

// Config view engine
configViewEngine(app);

// Enable post data for request
app.use(bodyParser.urlencoded({ extended: true }));

// Enable flash messages
app.use(connectFlash());

// Config passportjs
app.use(passport.initialize());
app.use(passport.session());
FacebookPassport.init();
GooglePassport.init();
LocalPassport.init();

// Init all routes
initRoutes(app);

app.listen(process.env.APP_PORT, process.env.APP_HOST, () => {
  console.log(`Hello, The Server is running at http://${process.env.APP_HOST}:${process.env.APP_PORT}/`);
});
