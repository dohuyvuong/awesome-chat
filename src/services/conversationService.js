import { MessageModel, ConversationModel, UserModel } from "../models";
import { CONVERSATION_TYPES } from "../models/conversationModel";
import dateUtil from "../utils/dateUtil";
import _ from "lodash";

/**
 * Create new conversation
 * @param {Array} userIds list of userId
 */
let createNewConversation = async (userIds, name, creatorId) => {
  if (userIds.length === 2) {
    return await ConversationModel.createNew({
      members: userIds.map(userId => {
        return { userId };
      }),
    });
  }

  return await ConversationModel.createNew({
    name,
    conversationType: CONVERSATION_TYPES.GROUP,
    creatorId,
    members: userIds.map(userId => { userId }),
    userAmount: userIds.length,
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
    conversation.messages.forEach(async message => {
      message.sender = await UserModel.findUserById(message.senderId);
    });
    conversation.users = await UserModel.findByIds(conversation.members.map(member => member.userId));
    if (conversation.members.length === 2) {
      let otherUserId = conversation.members.filter(member => member.userId != currentUserId)[0].userId;
      let otherUser = await UserModel.findUserById(otherUserId);
      conversation.name = otherUser.username;
      conversation.avatar = otherUser.avatar;
    } else {
      if (!conversation.name) {
        let joinedNames = conversation.users.filter(user => currentUserId.toString() != user._id.toString()).map(user => user.username).join(", ");
        conversation.name = joinedNames;
      }
      conversation.avatar = "group-avatar-trungquandev.png";
    }

    return conversation;
  });

  return await Promise.all(conversations);
};

export const conversationService = {
  createNewConversation,
  getConversations,
};
