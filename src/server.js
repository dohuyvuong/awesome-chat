import express from "express";
import connectDB from "./config/connectDB";
import ContactModel from "./models/contact.model";

let app = express();

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/test-db", async (req, res) => {
  try {
    let item = {
      userId: "10000",
      contactId: "10001"
    };

    let contact = await ContactModel.createNew(item);

    res.send(contact);
  } catch (error) {
    console.log(error);
  }
});

app.listen(process.env.APP_PORT, process.env.APP_HOST, ()=> {
  console.log(`Hello, The Server is running at http://${process.env.APP_HOST}:${process.env.APP_PORT}/`);
});
