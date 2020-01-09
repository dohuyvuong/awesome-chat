import express from "express";
import { notificationService, contactService, conversationService } from "../services";
import { transErrors } from "../../lang/vi";
import clientUtil from "../utils/clientUtil";
import logger from "winston";

/**
 * Return Response rendered Homepage
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getHome = async (req, res) => {
  logger.info("Get home page");

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

    let conversations = await conversationService.getConversations(currentUserId);
    let groupConversations = conversations.filter(conversation => conversation.userAmount > 2);
    let personalConversations = conversations.filter(conversation => conversation.userAmount === 2);

    return res.render("main/home/home", {
      clientUtil,
      notifications,
      noOfUnreadNotifications,
      contactsAsUsers,
      noOfContacts,
      sentRequestingContactsAsUsers,
      noOfSentRequestingContacts,
      receivedRequestingContactsAsUsers,
      noOfReceivedRequestingContacts,
      conversations,
      groupConversations,
      personalConversations,
      errors: req.flash("errors"),
      success: req.flash("success"),
      user: req.user,
    });
  } catch (error) {
    // Log error
    logger.error(error);

    return res.status(500).send(transErrors.server_error);
  }
};

export const homeController = {
  getHome,
};
