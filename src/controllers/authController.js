import { validationResult } from "express-validator";
import { authService } from "../services";
import { transSuccess, transNotify } from "../../lang/vi";

let getLoginRegister = (req, res) => {
  return res.render("auth/master", {
    errors: req.flash("errors"),
    success: req.flash("success"),
  });
};

let postRegister = async (req, res) => {
  let errors = [];
  let success = [];

  let validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    errors.push(validationErrors.errors.map(error => error.msg));
    req.flash("errors", errors);

    return res.redirect("/login-register");
  }

  try {
    let successMsg = await authService.register(
      req.body.email,
      req.body.gender,
      req.body.password,
      req.protocol,
      req.get("host")
    );

    success.push(successMsg);
    req.flash("success", success);

    return res.redirect("/login-register");
  } catch (error) {
    errors.push(error);
    req.flash("errors", errors);

    return res.redirect("/login-register");
  }
};

let verifyAccount = async (req, res) => {
  let errors = [];
  let success = [];

  let verifyToken = req.query.verifyToken;

  try {
    let successMsg = await authService.verifyAccount(verifyToken);

    success.push(successMsg);
    req.flash("success", successMsg);

    return res.redirect("/login-register");
  } catch (error) {
    errors.push(error);
    req.flash("errors", errors);

    return res.redirect("/login-register");
  }
};

let getLogout = (req, res) => {
  // Remove session passport user
  req.logout();
  req.flash("success", transSuccess.logout_successfully);

  return res.redirect("/login-register");
};

let checkLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login-register");
  }

  next();
};

let checkNotLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.flash("success", transNotify.user_logging_in);

    return res.redirect("/");
  }

  next();
};

export const authController = {
  getLoginRegister,
  postRegister,
  verifyAccount,
  getLogout,
  checkLoggedIn,
  checkNotLoggedIn,
};
