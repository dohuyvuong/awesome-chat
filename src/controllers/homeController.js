import express from "express";

/**
 * Return Response rendered Homepage
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getHome = (req, res) => {
  return res.render("main/home/home", {
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user,
  });
};

export const homeController = {
  getHome,
};
