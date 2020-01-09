import express from "express";
import { validationResult } from "express-validator";
import { transErrors } from "../../lang/vi";
import { conversationService } from "../services";
import _ from "lodash";
import logger from "winston";

/**
 * Add new personal conversation
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let addNewPersonalConversation = async (req, res) => {
  logger.info("Add new personal conversation");

  let validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    // Log error
    logger.error(validationErrors.errors.map(error => error.msg).join("; "));

    return res.status(400).send(validationErrors.errors.map(error => error.msg).join(", "));
  }

  try {
    let currentUserId = req.user._id.toString();
    let userId = req.body.userId;

    if (userId == currentUserId) {
      return res.status(400).send(transErrors.conversation_personal_add_new_invalid_size);
    }

    let result = await conversationService.createNewPersonalConversation(currentUserId, userId);

    return res.status(200).send(result);
  } catch (error) {
    // Log error
    logger.error(error);

    if (
      error === transErrors.user_not_found ||
      error === transErrors.conversation_add_new_user_is_not_contact ||
      error === transErrors.conversation_personal_add_new_existed
    ) {
      return res.status(400).send(error);
    }

    return res.status(500).send(transErrors.server_error);
  }
};

/**
 * Add new group conversation
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let addNewGroupConversation = async (req, res) => {
  logger.info("Add new group conversation");

  let validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    // Log error
    logger.error(validationErrors.errors.map(error => error.msg).join("; "));

    return res.status(400).send(validationErrors.errors.map(error => error.msg).join(", "));
  }

  try {
    let currentUserId = req.user._id.toString();
    let userIds = req.body.userIds;
    let name = req.body.name;

    userIds.push(currentUserId);
    userIds = _.uniq(userIds);
    userIds = userIds.filter(userId => userId != currentUserId);

    if (userIds.length < 2) {
      return res.status(400).send(transErrors.conversation_group_add_new_invalid_size);
    }

    let result = await conversationService.createNewGroupConversation(currentUserId, userIds, name);

    return res.status(200).send(result);
  } catch (error) {
    // Log error
    logger.error(error);

    if (error === transErrors.user_not_found || error === transErrors.conversation_add_new_user_is_not_contact) {
      return res.status(400).send(error);
    }

    return res.status(500).send(transErrors.server_error);
  }
};

/**
 * Remove personal conversation
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let removePersonalConversation = async (req, res) => {
  logger.info("Remove personal conversation");

  try {
    let currentUserId = req.user._id.toString();
    let userId = req.body.userId;

    if (userId == currentUserId) {
      return res.status(400).send(transErrors.bad_request);
    }

    let result = await conversationService.removePersonalConversation(currentUserId, userId);

    return res.status(200).send(result);
  } catch (error) {
    // Log error
    logger.error(error);

    return res.status(500).send(transErrors.server_error);
  }
};

/**
 * Get conversations
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getConversations = async (req, res) => {
  logger.info("Get conversations");

  try {
    let currentUserId = req.user._id;
    let offset = +req.query.offset;
    let limit = +req.query.limit;

    offset = isNaN(offset) ? undefined : offset;
    limit = isNaN(limit) ? undefined : limit;

    let conversations = await conversationService.getConversations(currentUserId, offset, limit);

    return res.status(200).send(conversations);
  } catch (error) {
    // Log error
    logger.error(error);

    return res.status(500).send(transErrors.server_error);
  }
}

export const conversationController = {
  addNewPersonalConversation,
  addNewGroupConversation,
  removePersonalConversation,
  getConversations,
};
