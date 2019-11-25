import mongoose from "mongoose";

let Schema = mongoose.Schema;

const CONVERSATION_TYPES = {
  GROUP: "group",
  PERSONAL: "personal",
};

let ConversationSchema = new Schema({
  name: { type: String, default: null },
  conversationType: { type: String, default: CONVERSATION_TYPES.PERSONAL },
  creatorId: { type: String, default: null },
  members: [{ userId: String }],
  userAmount: { type: Number, default: 2, min: 2, max: 100 },
  messageAmount: { type: Number, default: 0 },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: Date.now },
  deletedAt: { type: Number, default: null },
});

ConversationSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  findConversationById(id) {
    return this.findById(id).exec();
  },

  getConversations(userId, offest, limit) {
    return this.find({
      "members": {
        $elemMatch: {
          "userId": userId,
        },
      },
    }).sort({ "updatedAt": -1 }).skip(offest).limit(limit).exec();
  },

  getConversation(userIds) {
    return this.findOne({
      "members": {
        $elemMatch: {
          "userId": { $in: userIds },
        },
        $size: userIds.length,
      },
    }).exec();
  },

  checkUserInConversation(userId, conversationId) {
    return this.findOne({
      $and: [
        {
          "_id": conversationId,
        },
        {
          "members": {
            $elemMatch: {
              "userId": userId,
            },
          }
        },
      ],
    }).exec();
  },

  updateAfterAddedNewMessage(conversationId, addedTime) {
    return this.updateOne({
      "_id": conversationId,
    }, {
      $inc: { "messageAmount": 1 },
      "updatedAt": addedTime,
    }).exec();
  },
};

export {
  CONVERSATION_TYPES,
};
export default mongoose.model("conversation", ConversationSchema);
