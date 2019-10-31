import express from "express";
import { notificationService, contactService } from "../services";
import { transErrors } from "../../lang/vi";

/**
 * Return Response rendered Homepage
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getHome = async (req, res) => {
  try {
    let currentUserId = req.user._id;

    // Get notifications with default limit and number of unread notifications
    let notifications = await notificationService.getNotifications(currentUserId);
    let noOfUnreadNotifications = await notificationService.getNoOfUnreadNotifications(currentUserId);

    // Get contacts
    let contactsAsUsers = await contactService.getContactsAsUsers(currentUserId);
    let noOfContacts = await contactService.getNoOfContacts(currentUserId);

    // Get sent requesting contacts
    let sentRequestingContactsAsUsers = await contactService.getSentRequestingContactsAsUsers(currentUserId);
    let noOfSentRequestingContacts = await contactService.getNoOfSentRequestingContacts(currentUserId);

    // Get received requesting contacts
    let receivedRequestingContactsAsUsers = await contactService.getReceivedRequestingContactsAsUsers(currentUserId);
    let noOfReceivedRequestingContacts = await contactService.getNoOfReceivedRequestingContacts(currentUserId);

    return res.render("main/home/home", {
      notifications,
      noOfUnreadNotifications,
      contactsAsUsers,
      noOfContacts,
      sentRequestingContactsAsUsers,
      noOfSentRequestingContacts,
      receivedRequestingContactsAsUsers,
      noOfReceivedRequestingContacts,
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
