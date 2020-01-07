import express from "express";
import { validationResult } from "express-validator";
import { contactService } from "../services";
import { transErrors } from "../../lang/vi";
import logger from "winston";

/**
 * Search users to add new contact
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let searchNewContact = async (req, res) => {
  logger.info("Search new contact");

  let validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    let errors = validationErrors.errors.map(error => error.msg);

    // Log error
    logger.error(errors);

    return res.status(400).send(errors);
  }

  try {
    let currentUserId = req.user._id;
    let keyword = req.query.keyword;

    let users = await contactService.searchNewContact(keyword, currentUserId);

    return res.render("main/contact/sections/foundUsersToAddNewContact", { users });
  } catch (error) {
    // Log error
    logger.error(error);

    return res.status(500).send(transErrors.server_error);
  }
}

/**
 * Add new contact
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let addNewContact = async (req, res) => {
  logger.info("Add new contact");

  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let result = await contactService.addNewContact(currentUserId, contactId);

    return res.status(200).send({ result });
  } catch (error) {
    // Log error
    logger.error(error);

    return res.status(500).send(transErrors.server_error);
  }
}

/**
 * Remove sent requesting contact
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let removeSentRequestingContact = async (req, res) => {
  logger.info("Remove sent requesting contact");

  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let result = await contactService.removeSentRequestingContact(currentUserId, contactId);

    return res.status(200).send({ result });
  } catch (error) {
    // Log error
    logger.error(error);

    return res.status(500).send(transErrors.server_error);
  }
}

/**
 * Reject received requesting contact
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let rejectReceivedRequestingContact = async (req, res) => {
  logger.info("Reject received requesting contact");

  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let result = await contactService.rejectReceivedRequestingContact(currentUserId, contactId);

    return res.status(200).send({ result });
  } catch (error) {
    // Log error
    logger.error(error);

    return res.status(500).send(transErrors.server_error);
  }
}

/**
 * Accept received requesting contact
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let acceptReceivedRequestingContact = async (req, res) => {
  logger.info("Accept received requesting contact");

  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let result = await contactService.acceptReceivedRequestingContact(currentUserId, contactId);

    return res.status(200).send({ result });
  } catch (error) {
    // Log error
    logger.error(error);

    return res.status(500).send(transErrors.server_error);
  }
}

/**
 * Remove contact
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let removeContact = async (req, res) => {
  logger.info("Remove contact");

  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let result = await contactService.removeContact(currentUserId, contactId);

    return res.status(200).send({ result });
  } catch (error) {
    // Log error
    logger.error(error);

    return res.status(500).send(transErrors.server_error);
  }
}

/**
 * Get contacts as users
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getContactsAsUsers = async (req, res) => {
  logger.info("Get contacts as users");

  try {
    let currentUserId = req.user._id;
    let offset = +req.query.offset;
    let limit = +req.query.limit;

    offset = isNaN(offset) ? undefined : offset;
    limit = isNaN(limit) ? undefined : limit;

    let contactsAsUsers = await contactService.getContactsAsUsers(currentUserId, offset, limit);

    return res.status(200).send(contactsAsUsers);
  } catch (error) {
    // Log error
    logger.error(error);

    return res.status(500).send(transErrors.server_error);
  }
}

/**
 * Get sent requesting contacts as users
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getSentRequestingContactsAsUsers = async (req, res) => {
  logger.info("Get sent requesting contacts as users");

  try {
    let currentUserId = req.user._id;
    let offset = +req.query.offset;
    let limit = +req.query.limit;

    offset = isNaN(offset) ? undefined : offset;
    limit = isNaN(limit) ? undefined : limit;

    let sentRequestingContactsAsUsers = await contactService.getSentRequestingContactsAsUsers(currentUserId, offset, limit);

    return res.status(200).send(sentRequestingContactsAsUsers);
  } catch (error) {
    // Log error
    logger.error(error);

    return res.status(500).send(transErrors.server_error);
  }
}

/**
 * Get received requesting contacts as users
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getReceivedRequestingContactsAsUsers = async (req, res) => {
  logger.info("Get received requesting contacts as users");

  try {
    let currentUserId = req.user._id;
    let offset = +req.query.offset;
    let limit = +req.query.limit;

    offset = isNaN(offset) ? undefined : offset;
    limit = isNaN(limit) ? undefined : limit;

    let receivedRequestingContactsAsUsers = await contactService.getReceivedRequestingContactsAsUsers(currentUserId, offset, limit);

    return res.status(200).send(receivedRequestingContactsAsUsers);
  } catch (error) {
    // Log error
    logger.error(error);

    return res.status(500).send(transErrors.server_error);
  }
}

/**
 * Find users to add to group chat
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let findContact = async (req, res) => {
  logger.info("Find contacts");

  let validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    let errors = validationErrors.errors.map(error => error.msg);

    // Log error
    logger.error(errors);

    return res.status(400).send(errors);
  }

  try {
    let currentUserId = req.user._id;
    let keyword = req.query.keyword;

    let users = await contactService.findContact(keyword, currentUserId);

    return res.render("main/groupChat/sections/foundUsersToAddToNewGroupChat", { users });
  } catch (error) {
    // Log error
    logger.error(error);

    return res.status(500).send(transErrors.server_error);
  }
}

export const contactController = {
  searchNewContact,
  addNewContact,
  removeSentRequestingContact,
  rejectReceivedRequestingContact,
  acceptReceivedRequestingContact,
  removeContact,
  getContactsAsUsers,
  getSentRequestingContactsAsUsers,
  getReceivedRequestingContactsAsUsers,
  findContact,
};
