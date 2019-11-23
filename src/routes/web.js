import express from "express";
import { homeController, authController, userController, contactController, notificationController, messageController } from "../controllers";
import { authValidation, userValidation, contactValidation, messageValidation } from "../validations";
import passport from "passport";

let router = express.Router();

/**
 * Init all routes
 * @param {express.Express} app from exactly express module
 */
let initRoutes = (app) => {
  router.get("/login-register", authController.checkNotLoggedIn, authController.getLoginRegister);
  router.post("/register", authController.checkNotLoggedIn, authValidation.register, authController.postRegister);
  router.get("/verify", authController.checkNotLoggedIn, authController.verifyAccount);
  router.post("/login", authController.checkNotLoggedIn, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login-register",
    successFlash: true,
    failureFlash: true,
  }));
  router.get("/auth/facebook", authController.checkNotLoggedIn, passport.authenticate("facebook", { scope: ["email"] }));
  router.get("/auth/facebook/callback", authController.checkNotLoggedIn, passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login-register",
  }));
  router.get("/auth/google", authController.checkNotLoggedIn, passport.authenticate("google", { scope: ["profile"] }));
  router.get("/auth/google/callback", authController.checkNotLoggedIn, passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login-register",
  }));

  router.get("/", authController.checkLoggedIn, homeController.getHome);
  router.get("/logout", authController.checkLoggedIn, authController.getLogout);

  router.put("/user/update-avatar", authController.checkLoggedIn, userController.updateAvatar);
  router.put("/user/update-info", authController.checkLoggedIn, userValidation.updateInfo, userController.updateInfo);
  router.put("/user/update-password", authController.checkLoggedIn, userValidation.updatePassword, userController.updatePassword);

  router.get("/contact/search", authController.checkLoggedIn, contactValidation.searchNewContact, contactController.searchNewContact);
  router.post("/contact/add", authController.checkLoggedIn, contactController.addNewContact);
  router.delete("/contact/remove-sent-requesting-contact", authController.checkLoggedIn, contactController.removeSentRequestingContact);
  router.delete("/contact/reject-received-requesting-contact", authController.checkLoggedIn, contactController.rejectReceivedRequestingContact);
  router.put("/contact/accept-received-requesting-contact", authController.checkLoggedIn, contactController.acceptReceivedRequestingContact);
  router.delete("/contact/remove-contact", authController.checkLoggedIn, contactController.removeContact);
  router.get("/contact/get-contacts-as-users", authController.checkLoggedIn, contactController.getContactsAsUsers);
  router.get("/contact/get-sent-requesting-contacts-as-users", authController.checkLoggedIn, contactController.getSentRequestingContactsAsUsers);
  router.get("/contact/get-received-requesting-contacts-as-users", authController.checkLoggedIn, contactController.getReceivedRequestingContactsAsUsers);

  router.get("/notification/get-notifications", authController.checkLoggedIn, notificationController.getNotifications);
  router.put("/notification/mark-notifications-as-read", authController.checkLoggedIn, notificationController.markNotificationsAsRead);

  router.post("/message/add-new-message-text", authController.checkLoggedIn, messageValidation.checkMessageText, messageController.addNewMessageText);

  return app.use("/", router);
};

export default initRoutes;
