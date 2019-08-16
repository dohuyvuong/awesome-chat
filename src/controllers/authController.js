import { validationResult } from "express-validator";
import { auth } from "../services";

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
    let successMsg = await auth.register(
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
    let successMsg = await auth.verifyAccount(verifyToken);

    success.push(successMsg);
    req.flash("success", successMsg);

    return res.redirect("/login-register");
  } catch (error) {
    errors.push(error);
    req.flash("errors", errors);

    return res.redirect("/login-register");
  }
};

module.exports = {
  getLoginRegister,
  postRegister,
  verifyAccount,
};
