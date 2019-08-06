import express from "express";
import connectDB from "./config/connectDB";
import configViewEngine from "./config/viewEngine";

// Init app
let app = express();

// Connect to MongoDB
connectDB();

// Config view engine
configViewEngine(app);

app.get("/", (req, res) => {
  return res.render("main/master");
});

app.get("/auth", (req, res) => {
  return res.render("auth/loginRegister");
});

app.listen(process.env.APP_PORT, process.env.APP_HOST, ()=> {
  console.log(`Hello, The Server is running at http://${process.env.APP_HOST}:${process.env.APP_PORT}/`);
});
