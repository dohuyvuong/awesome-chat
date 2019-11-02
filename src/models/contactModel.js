import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
  userId: String,
  contactId: String,
  status: { type: Boolean, default: false },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null },
});

ContactSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  findByUserId(userId) {
    return this.find({
      $or: [
        { "userId": userId },
        { "contactId": userId },
      ],
    }).exec();
  },

  findContact(userId, contactId) {
    return this.findOne({
      $or: [
        {
          $and: [
            { "userId": userId },
            { "contactId": contactId },
          ],
        },
        {
          $and: [
            { "userId": contactId },
            { "contactId": userId },
          ],
        },
      ],
    }).exec();
  },

  getContacts(userId, offset, limit) {
    return this.find({
      $and: [
        {
          $or: [
            { "userId": userId },
            { "contactId": userId },
          ],
        },
        { "status": true },
      ],
    }).sort({ "createdAt": -1 }).skip(offset).limit(limit).exec();
  },

  getNoOfContacts(userId) {
    return this.countDocuments({
      $and: [
        {
          $or: [
            { "userId": userId },
            { "contactId": userId },
          ],
        },
        { "status": true },
      ],
    }).exec();
  },

  getSentRequestingContacts(userId, offset, limit) {
    return this.find({
      $and: [
        { "userId": userId },
        { "status": false },
      ],
    }).sort({ "createdAt": -1 }).skip(offset).limit(limit).exec();
  },

  getNoOfSentRequestingContacts(userId) {
    return this.countDocuments({
      $and: [
        { "userId": userId },
        { "status": false },
      ],
    }).exec();
  },

  getReceivedRequestingContacts(userId, offset, limit) {
    return this.find({
      $and: [
        { "contactId": userId },
        { "status": false },
      ],
    }).sort({ "createdAt": -1 }).skip(offset).limit(limit).exec();
  },

  getNoOfReceivedRequestingContacts(userId) {
    return this.countDocuments({
      $and: [
        { "contactId": userId },
        { "status": false },
      ],
    }).exec();
  },

  removeSentRequestingContact(userId, contactId) {
    return this.deleteOne({
      $and: [
        { "userId": userId },
        { "contactId": contactId },
        { "status": false },
      ],
    }).exec();
  },

  rejectReceivedRequestingContact(userId, contactId) {
    return this.deleteOne({
      $and: [
        { "userId": contactId },
        { "contactId": userId },
        { "status": false },
      ],
    }).exec();
  },
};

export default mongoose.model("contact", ContactSchema);
