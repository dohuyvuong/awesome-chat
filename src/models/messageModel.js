import mongoose from "mongoose";

let Schema = mongoose.Schema;

const MESSAGE_TYPES = {
  TEXT: "text",
  IMAGE: "image",
  FILE: "file",
};

let MessageSchema = new Schema({
  senderId: String,
  conversationId: String,
  messageType: { type: String, default: MESSAGE_TYPES.TEXT },
  text: String,
  file: {
    data: Buffer,
    contentType: String,
    fileName: String,
  },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null },
});

MessageSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  getByConversationId(conversationId, offset, limit) {
    return this.find({
      "conversationId": conversationId,
    }).sort({ "createdAt": -1 }).skip(offset).limit(limit).exec();
  },

  // getLatestConversations(offset, limit) {
  //   return this.aggregate([
  //     {
  //       $group: {
  //         _id: "$conversationId",
  //         lastMessageAt: {
  //           $max: "createdAt",
  //         },
  //       },
  //     },
  //   ]).sort({ "lastMessageAt": -1 }).skip(offset).limit(limit).exec();
  // },
};

export {
  MESSAGE_TYPES,
};
export default mongoose.model("message", MessageSchema);
