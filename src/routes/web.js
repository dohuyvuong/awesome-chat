import express from "express";
import { home, auth } from "../controllers";
import { authValid } from "../validations";
import passport from "passport";
import initPassportLocal from "../controllers/passportController/local";

// Init all passport
initPassportLocal();

let router = express.Router();

/**
 * Init all routes
 * @param app from exactly express module
 */
let initRoutes = (app) => {
  router.get("/login-register", auth.checkNotLoggedIn, auth.getLoginRegister);
  router.post("/register", auth.checkNotLoggedIn, authValid.register, auth.postRegister);
  router.get("/verify", auth.checkNotLoggedIn, auth.verifyAccount);
  router.post("/login", auth.checkNotLoggedIn, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login-register",
    successFlash: true,
    failureFlash: true,
  }));

  router.get("/", auth.checkLoggedIn, home.getHome);
  router.get("/logout", auth.checkLoggedIn, auth.getLogout);

  return app.use("/", router);
};

module.exports = initRoutes;
