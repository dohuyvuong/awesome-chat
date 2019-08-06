import express from "express";
import expressEJSExtend from "express-ejs-extend";

/**
 * Config view engine for app
 */
let configViewEngine = (app) => {
  app.use(express.static("./src/public"));
  app.use("ejs", expressEJSExtend);
  app.set("view engine", "ejs");
  app.set("views", "./src/views");
}

module.exports = configViewEngine;
