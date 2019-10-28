import express from "express";
import { notificationService } from "../services";
import { transErrors } from "../../lang/vi";

/**
 * Return Response rendered Homepage
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getHome = async (req, res) => {
  try {
    let currentUserId = req.user._id;

    let notifications = await notificationService.getNotifications(currentUserId);
    let noOfUnreadNotifications = await notificationService.getNoOfUnreadNotifications(currentUserId);

    return res.render("main/home/home", {
      notifications,
      noOfUnreadNotifications,
      errors: req.flash("errors"),
      success: req.flash("success"),
      user: req.user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(transErrors.server_error);
  }
};

export const homeController = {
  getHome,
};
