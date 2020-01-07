import express from "express";
import { validationResult } from "express-validator";
import { transErrors } from "../../lang/vi";
import { messageService } from "../services";
import multer from "multer";
import { appConfigure } from "../config/app";
import fsExtra from "fs-extra";
import { ConversationModel } from "../models";
import logger, { error } from "winston";

let messageImageStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (!fsExtra.existsSync(appConfigure.messageImageDirectory)){
      fsExtra.mkdirSync(appConfigure.messageImageDirectory, { recursive: true });
    }

    callback(null, appConfigure.messageImageDirectory);
  },
  filename: (req, file, callback) => {
    let match = appConfigure.messageImageType;
    if (!match.includes(file.mimetype)) {
      return callback(transErrors.message_image_type_not_supported, null);
    }

    let messageImageFileName = `${Date.now()}-${file.originalname}`;
    callback(null, messageImageFileName);
  },
});

let messageImageUploadedFile = multer({
  storage: messageImageStorage,
  limits: { fileSize: appConfigure.messageImageLimitedSize },
}).single("my-image-chat");

let messageAttachmentStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (!fsExtra.existsSync(appConfigure.messageAttachmentDirectory)){
      fsExtra.mkdirSync(appConfigure.messageAttachmentDirectory, { recursive: true });
    }

    callback(null, appConfigure.messageAttachmentDirectory);
  },
  filename: (req, file, callback) => {
    let messageAttachmentFileName = `${Date.now()}-${file.originalname}`;
    callback(null, messageAttachmentFileName);
  },
});

let messageAttachmentUploadedFile = multer({
  storage: messageAttachmentStorage,
  limits: { fileSize: appConfigure.messageAttachmentLimitedSize },
}).single("my-attach-chat");

/**
 * Add new message text
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let addNewMessageText = async (req, res) => {
  logger.info("Add new message text");

  let validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    // Log error
    logger.error(validationErrors.errors.map(error => error.msg).join("; "));

    return res.status(400).send(validationErrors.errors.map(error => error.msg).join(", "));
  }

  try {
    let currentUserId = req.user._id;
    let conversationId = req.body.conversationId;
    let text = req.body.text;

    let result = await messageService.addNewMessageText(currentUserId, conversationId, text);

    return res.status(200).send(result);
  } catch (error) {
    // Log error
    logger.error(error);

    if (error == transErrors.message_user_not_in_conversation) {
      return res.status(400).send(error);
    }

    return res.status(500).send(transErrors.server_error);
  }
};

/**
 * Add new message image
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let addNewMessageImage = async (req, res) => {
  logger.info("Add new message image");

  messageImageUploadedFile(req, res, async (error) => {
    if (error) {
      if (error.code && error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).send(transErrors.message_image_size_too_large);
      }
      if (error === transErrors.message_image_type_not_supported) {
        return res.status(400).send(error);
      }

      return res.status(500).send(transErrors.server_error);
    }

    try {
      let currentUserId = req.user._id;
      let conversationId = req.body.conversationId;
      let file = req.file;

      let result = await messageService.addNewMessageImage(currentUserId, conversationId, file);

      // Remove image from storage
      await fsExtra.remove(`${appConfigure.messageImageDirectory}/${file.filename}`);

      return res.status(200).send(result);
    } catch (error) {
      // Log error
      logger.error(error);

      if (error == transErrors.message_user_not_in_conversation) {
        return res.status(400).send(error);
      }

      return res.status(500).send(transErrors.server_error);
    }
  });
};

/**
 * Add new message attachment
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let addNewMessageAttachment = async (req, res) => {
  logger.info("Add new message attachment");

  messageAttachmentUploadedFile(req, res, async (error) => {
    if (error) {
      if (error.code && error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).send(transErrors.message_attachment_size_too_large);
      }

      return res.status(500).send(transErrors.server_error);
    }

    try {
      let currentUserId = req.user._id;
      let conversationId = req.body.conversationId;
      let file = req.file;

      let result = await messageService.addNewMessageAttachment(currentUserId, conversationId, file);

      // Remove file from storage
      await fsExtra.remove(`${appConfigure.messageAttachmentDirectory}/${file.filename}`);

      return res.status(200).send(result);
    } catch (error) {
      // Log error
      logger.error(error);

      if (error == transErrors.message_user_not_in_conversation) {
        return res.status(400).send(error);
      }

      return res.status(500).send(transErrors.server_error);
    }
  });
};

/**
 * Get messages
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getMessages = async (req, res) => {
  logger("Get messages");

  try {
    let currentUserId = req.user._id;
    let conversationId = req.query.conversationId;
    let offset = +req.query.offset;
    let limit = +req.query.limit;

    offset = isNaN(offset) ? undefined : offset;
    limit = isNaN(limit) ? undefined : limit;

    let conversation = await ConversationModel.checkUserInConversation(currentUserId, conversationId);

    if (!conversation) {
      throw transErrors.message_user_not_in_conversation;
    }

    let messages = await messageService.getMessagesByConversationId(currentUserId, conversationId, offset, limit);

    return res.status(200).send(messages);
  } catch (error) {
    // Log error
    logger.error(error);

    return res.status(500).send(transErrors.server_error);
  }
}

export const messageController = {
  addNewMessageText,
  addNewMessageImage,
  addNewMessageAttachment,
  getMessages,
};
