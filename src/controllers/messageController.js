import express from "express";
import { validationResult } from "express-validator";
import { transErrors } from "../../lang/vi";
import { messageService } from "../services";

/**
 * Get notifications
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let addNewMessageText = async (req, res) => {
  let validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(400).send(validationErrors.errors.map(error => error.msg).join(", "));
  }

  try {
    let currentUserId = req.user._id;
    let conversationId = req.body.conversationId;
    let text = req.body.text;

    let result = await messageService.addNewMessageText(currentUserId, conversationId, text);

    return res.status(200).send(result);
  } catch (error) {
    if (error == transErrors.message_user_not_in_conversation) {
      return res.status(400).send(error);
    }

    return res.status(500).send(transErrors.server_error);
  }
};

export const messageController = {
  addNewMessageText,
};
