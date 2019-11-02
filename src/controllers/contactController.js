import express from "express";
import { validationResult } from "express-validator";
import { contactService } from "../services";
import { transErrors } from "../../lang/vi";

/**
 * Search users to add new contact
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let searchNewContact = async (req, res) => {
  let validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    let errors = validationErrors.errors.map(error => error.msg);

    return res.status(400).send(errors);
  }

  try {
    let currentUserId = req.user._id;
    let keyword = req.query.keyword;

    let users = await contactService.searchNewContact(keyword, currentUserId);

    return res.render("main/contact/sections/foundContactItem", { users });
  } catch (error) {
    return res.status(500).send(transErrors.server_error);
  }
}

/**
 * Add new contact
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let addNewContact = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let result = await contactService.addNewContact(currentUserId, contactId);

    return res.status(200).send({ result });
  } catch (error) {
    return res.status(500).send(transErrors.server_error);
  }
}

/**
 * Remove sent requesting contact
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let removeSentRequestingContact = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let result = await contactService.removeSentRequestingContact(currentUserId, contactId);

    return res.status(200).send({ result });
  } catch (error) {
    return res.status(500).send(transErrors.server_error);
  }
}

/**
 * Reject received requesting contact
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let rejectReceivedRequestingContact = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let result = await contactService.rejectReceivedRequestingContact(currentUserId, contactId);

    return res.status(200).send({ result });
  } catch (error) {
    return res.status(500).send(transErrors.server_error);
  }
}

/**
 * Get contacts as users
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getContactsAsUsers = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let offset = +req.query.offset;
    let limit = +req.query.limit;

    if (typeof offset !== "number" || typeof limit !== "number") {
      return res.status(400).send(transErrors.bad_request);
    }

    let contactsAsUsers = await contactService.getContactsAsUsers(currentUserId, offset, limit);

    return res.status(200).send(contactsAsUsers);
  } catch (error) {
    return res.status(500).send(transErrors.server_error);
  }
}

/**
 * Get sent requesting contacts as users
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getSentRequestingContactsAsUsers = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let offset = +req.query.offset;
    let limit = +req.query.limit;

    if (typeof offset !== "number" || typeof limit !== "number") {
      return res.status(400).send(transErrors.bad_request);
    }

    let sentRequestingContactsAsUsers = await contactService.getSentRequestingContactsAsUsers(currentUserId, offset, limit);

    return res.status(200).send(sentRequestingContactsAsUsers);
  } catch (error) {
    return res.status(500).send(transErrors.server_error);
  }
}

/**
 * Get received requesting contacts as users
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getReceivedRequestingContactsAsUsers = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let offset = +req.query.offset;
    let limit = +req.query.limit;

    if (typeof offset !== "number" || typeof limit !== "number") {
      return res.status(400).send(transErrors.bad_request);
    }

    let receivedRequestingContactsAsUsers = await contactService.getReceivedRequestingContactsAsUsers(currentUserId, offset, limit);

    return res.status(200).send(receivedRequestingContactsAsUsers);
  } catch (error) {
    return res.status(500).send(transErrors.server_error);
  }
}

export const contactController = {
  searchNewContact,
  addNewContact,
  removeSentRequestingContact,
  rejectReceivedRequestingContact,
  getContactsAsUsers,
  getSentRequestingContactsAsUsers,
  getReceivedRequestingContactsAsUsers,
};
