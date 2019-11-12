import { MessageModel, ConversationModel } from "../models";
import { transErrors } from "../../lang/vi";

/**
 * Create a new message
 * @param {String} senderId
 * @param {String} conversationId
 * @param {String} messageType
 * @param {String} text
 * @param {Buffer} file
 */
let createNewMessage = async (senderId, conversationId, messageType, text, file) => {
  let message = await MessageModel.createNew({
    senderId,
    conversationId,
    messageType,
    text,
    file,
  });

  await ConversationModel.updateAfterAddedNewMessage(conversationId, message.createdAt);

  return message;
};

export const messageService = {
  createNewMessage,
};
