import { MessageModel, ConversationModel, UserModel } from "../models";
import { transErrors } from "../../lang/vi";

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

export const messageService = {
  addNewMessageText,
};
