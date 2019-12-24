import express from "express";
import { validationResult } from "express-validator";
import { transErrors } from "../../lang/vi";
import { conversationService } from "../services";
import _ from "lodash";

/**
 * Add new personal conversation
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let addNewPersonalConversation = async (req, res) => {
  let validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(400).send(validationErrors.errors.map(error => error.msg).join(", "));
  }

  try {
    let currentUserId = req.user._id;
    let userId = req.body.userId;

    let userIds = [];
    userIds.push(userId);
    userIds.push(currentUserId.toString());
    userIds = _.uniq(userIds);

    if (userIds.length < 2) {
      return res.status(400).send(transErrors.personal_chat_add_new_invalid_size);
    }

    let result = await conversationService.createNewConversation(userIds);

    return res.status(200).send(result);
  } catch (error) {
    if (error === transErrors.personal_chat_add_new_existed) {
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
  let validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(400).send(validationErrors.errors.map(error => error.msg).join(", "));
  }

  try {
    let currentUserId = req.user._id;
    let userIds = req.body.userIds;
    let name = req.body.name;

    userIds.push(currentUserId.toString());
    userIds = _.uniq(userIds);

    if (userIds.length < 3) {
      return res.status(400).send(transErrors.group_chat_add_new_invalid_size);
    }

    let result = await conversationService.createNewConversation(userIds, name, currentUserId);

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(transErrors.server_error);
  }
};

export const conversationController = {
  addNewPersonalConversation,
  addNewGroupConversation,
};
