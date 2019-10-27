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
 * Remove requesting contact
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let removeRequestingContact = async (req, res) => {
  try {
    let currentUserId = req.user._id;
    let contactId = req.body.uid;

    let result = await contactService.removeRequestingContact(currentUserId, contactId);

    return res.status(200).send({ result });
  } catch (error) {
    return res.status(500).send(transErrors.server_error);
  }
}

export const contactController = {
  searchNewContact,
  addNewContact,
  removeRequestingContact,
};
