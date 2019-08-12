import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyParser from "body-parser";

// Init app
let app = express();

// Connect to MongoDB
connectDB();

// Config view engine
configViewEngine(app);

// Enable post data for request
app.use(bodyParser.urlencoded({ extended: true }));

// Init all routes
initRoutes(app);

app.listen(process.env.APP_PORT, process.env.APP_HOST, ()=> {
  console.log(`Hello, The Server is running at http://${process.env.APP_HOST}:${process.env.APP_PORT}/`);
});
