import express from "express";
import expressEJSExtend from "express-ejs-extend";

/**
 * Config view engine for app
 * @param {express.Express} app from exactly express module
 */
let configViewEngine = (app) => {
  app.use(express.static("./src/public"));
  app.engine("ejs", expressEJSExtend);
  app.set("view engine", "ejs");
  app.set("views", "./src/views");
};

export default configViewEngine;
