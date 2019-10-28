import mongoose from "mongoose";

let Schema = mongoose.Schema;

const NOTIFICATION_TYPES = {
  ADD_CONTACT: "add_contact",
};

let NotificationSchema = new Schema({
  senderId: String,
  receiverId: String,
  type: String,
  isRead: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
});

NotificationSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  getByUserId(userId, offset, limit) {
    return this.find({
      "receiverId": userId,
    }).sort({ "createdAt": -1 }).skip(offset).limit(limit).exec();
  },

  getNoOfUnreadNotifications(userId) {
    return this.countDocuments({
      $and:[
        { "receiverId": userId },
        { "isRead": false },
      ],
    }).exec();
  },

  removeRequestingContactNotification(senderId, receiverId) {
    return this.deleteOne({
      $and: [
        { "senderId": senderId },
        { "receiverId": receiverId },
        { "type": NOTIFICATION_TYPES.ADD_CONTACT },
      ],
    }).exec();
  },
};

export {
  NOTIFICATION_TYPES,
};
export default mongoose.model("notification", NotificationSchema);
