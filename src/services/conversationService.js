import { MessageModel, ConversationModel, UserModel, ContactModel } from "../models";
import { CONVERSATION_TYPES } from "../models/conversationModel";
import dateUtil from "../utils/dateUtil";
import _ from "lodash";
import { transErrors } from "../../lang/vi";

/**
 * Create new personal conversation
 * @param {String} currentUserId Current user id
 * @param {String} userId target user id
 */
let createNewPersonalConversation = async (currentUserId, userId) => {
  let user = await UserModel.findUserById(userId);

  let contact = await ContactModel.findContact(currentUserId, userId);
  if (!contact) {
    throw transErrors.conversation_add_new_user_is_not_contact;
  }

  let conversation = await ConversationModel.getConversation([currentUserId, userId]);
  if (conversation) {
    throw transErrors.conversation_personal_add_new_existed;
  }

  let members = [
    { "userId": currentUserId },
    { "userId": userId },
  ];

  return await ConversationModel.createNew({
    name: user.username,
    members,
    avatar: user.avatar,
  });
};

/**
 * Create new group conversation
 * @param {String} currentUserId Current user id
 * @param {Array} userIds Target user ids
 * @param {String} name Name of group conversation
 */
let createNewGroupConversation = async (currentUserId, userIds, name) => {
  for (let i = 0; i < userIds.length; i++) {
    const userId = userIds[i];
    let contact = await ContactModel.findContact(currentUserId, userId);
      if (!contact) {
        throw transErrors.conversation_add_new_user_is_not_contact;
      }
  }

  let members = userIds.map(userId => ( { "userId": userId } ));
  members.push({ "userId": currentUserId });

  return await ConversationModel.createNew({
    name,
    conversationType: CONVERSATION_TYPES.GROUP,
    creatorId: currentUserId,
    members,
    userAmount: members.length,
  });
};

/**
 * Get conversations
 * @param {String} currentUserId Current user id
 * @param {Number} offset Offset default 0
 * @param {Number} limit Limit default 10
 */
let getConversations = async (currentUserId, offset = 0, limit = 15) => {
  let conversations = (await ConversationModel.getConversations(currentUserId, offset, limit)).map(async conversation => {
    conversation = conversation.toObject();

    conversation.updatedAtText = dateUtil.timeToNowAsText(conversation.updatedAt);
    let conversationMessages = await MessageModel.getByConversationId(conversation._id);
    conversation.messages = _.reverse(conversationMessages);
    for (let i = 0; i < conversation.messages.length; i++) {
      const message = conversation.messages[i];
      message.sender = await UserModel.findUserById(message.senderId);
    }
    conversation.users = await UserModel.findByIds(conversation.members.map(member => member.userId));
    if (!conversation.name) {
      let joinedNames = conversation.users.filter(user => currentUserId.toString() != user._id.toString()).map(user => user.username).join(", ");
      conversation.name = joinedNames;
    }

    return conversation;
  });

  return await Promise.all(conversations);
};

export const conversationService = {
  createNewPersonalConversation,
  createNewGroupConversation,
  getConversations,
};
