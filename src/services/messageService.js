import { MessageModel, ConversationModel, UserModel } from "../models";
import { transErrors } from "../../lang/vi";
import { MESSAGE_TYPES } from "../models/messageModel";
import fsExtra from "fs-extra";

/**
 * Add a new message
 * @param {Object} messageItem
 */
let addNewMessage = async (messageItem) => {
  let message = await MessageModel.createNew(messageItem);
  await ConversationModel.updateAfterAddedNewMessage(message.conversationId, message.createdAt);

  message = message.toObject();
  message.sender = await UserModel.findUserById(message.senderId);

  return message;
};

/**
 * Add a new message text to conversation
 * @param {String} senderId
 * @param {String} conversationId
 * @param {String} text
 */
let addNewMessageText = async (senderId, conversationId, text) => {
  let conversation = await ConversationModel.checkUserInConversation(senderId, conversationId);

  if (!conversation) {
    throw transErrors.message_user_not_in_conversation;
  }

  let newMessage = {
    senderId,
    conversationId,
    text,
  };

  return await addNewMessage(newMessage);
};

/**
 * Add a new message image to conversation
 * @param {String} senderId
 * @param {String} conversationId
 * @param {File} file
 */
let addNewMessageImage = async (senderId, conversationId, file) => {
  let conversation = await ConversationModel.checkUserInConversation(senderId, conversationId);

  if (!conversation) {
    throw transErrors.message_user_not_in_conversation;
  }

  let imageBuffer = await fsExtra.readFile(file.path);
  let imageContentType = file.mimetype;
  let imageName = file.originalname;

  let newMessage = {
    senderId,
    conversationId,
    messageType: MESSAGE_TYPES.IMAGE,
    file: {
      data: imageBuffer,
      contentType: imageContentType,
      fileName: imageName,
    },
  };

  return await addNewMessage(newMessage);
};

/**
 * Add a new message attachment to conversation
 * @param {String} senderId
 * @param {String} conversationId
 * @param {File} file
 */
let addNewMessageAttachment = async (senderId, conversationId, file) => {
  let conversation = await ConversationModel.checkUserInConversation(senderId, conversationId);

  if (!conversation) {
    throw transErrors.message_user_not_in_conversation;
  }

  let fileBuffer = await fsExtra.readFile(file.path);
  let fileContentType = file.mimetype;
  let fileName = file.originalname;

  let newMessage = {
    senderId,
    conversationId,
    messageType: MESSAGE_TYPES.FILE,
    file: {
      data: fileBuffer,
      contentType: fileContentType,
      fileName: fileName,
    },
  };

  return await addNewMessage(newMessage);
};

export const messageService = {
  addNewMessageText,
  addNewMessageImage,
  addNewMessageAttachment,
};
