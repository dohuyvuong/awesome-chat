import express from "express";
import { validationResult } from "express-validator";
import { authService } from "../services";
import { transSuccess, transNotify } from "../../lang/vi";

/**
 * Return Response rendered Login-Register Page
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getLoginRegister = (req, res) => {
  return res.render("auth/master", {
    errors: req.flash("errors"),
    success: req.flash("success"),
  });
};

/**
 * Register an account
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
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

/**
 * Verify account
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
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

/**
 * Logout
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getLogout = (req, res) => {
  // Remove session passport user
  req.logout();
  req.flash("success", transSuccess.logout_successfully);

  return res.redirect("/login-register");
};

/**
 * Check if the user is already logged in, otherwise login is required
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 * @param {express.NextFunction} next NextFunction
 */
let checkLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login-register");
  }

  next();
};

/**
 * Check if the user is not logged in, otherwise redirect to Homepage
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 * @param {express.NextFunction} next NextFunction
 */
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
