import mongoose from "mongoose";
import bcrypt from "bcrypt";

let Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: String,
  gender: { type: String, default: "male" },
  phone: { type: String, default: null },
  address: { type: String, default: null },
  avatar: { type: String, default: "avatar-default.jpg" },
  role: { type: String, default: "user" },
  local: {
    email: { type: String, trim: true },
    password: String,
    isActive: { type: Boolean, default: false },
    verifyToken: String,
  },
  facebook: {
    uid: String,
    token: String,
    email: { type: String, trim: true },
  },
  google: {
    uid: String,
    token: String,
    email: { type: String, trim: true },
  },
  createdAt: { type: Number, default: Date.now },
  updatedAt: { type: Number, default: null },
  deletedAt: { type: Number, default: null },
}, {
  toJSON: {
    transform: (doc, ret, options) => {
      if (ret.local) {
        delete ret.local.password
        delete ret.local.verifyToken;
      };
      if (ret.facebook) delete ret.facebook.token;
      if (ret.google) delete ret.google.token;

      return ret;
    },
  },
  toObject: {
    transform: (doc, ret, options) => {
      if (ret.local) {
        delete ret.local.password
        delete ret.local.verifyToken;
      };
      if (ret.facebook) delete ret.facebook.token;
      if (ret.google) delete ret.google.token;

      return ret;
    },
  },
});

UserSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  findUserById(id) {
    return this.findById(id).exec();
  },

  findByFacebookUid(uid) {
    return this.findOne({ "facebook.uid": uid }).exec();
  },

  findByGoogleUid(uid) {
    return this.findOne({ "google.uid": uid }).exec();
  },

  findByEmail(email) {
    return this.findOne({ "local.email": email }).exec();
  },

  findByVerifyToken(verifyToken) {
    return this.findOne({ "local.verifyToken": verifyToken }).exec();
  },

  findByKeywordAndExceptedIds(keyword, exceptedUserIds) {
    return this.find({
      $and: [
        { "_id": { $nin: exceptedUserIds } },
        { "local.isActive": true },
        {
          $or: [
            { "username": { "$regex": new RegExp(keyword, "i") } },
            { "local.email": { "$regex": new RegExp(keyword, "i") } },
            { "facebook.email": { "$regex": new RegExp(keyword, "i") } },
            { "google.email": { "$regex": new RegExp(keyword, "i") } },
          ],
        },
      ],
    }, {
      _id: 1,
      username: 1,
      address: 1,
      avatar: 1,
    }).exec();
  },

  findByKeywordAndIds(keyword, userIds) {
    return this.find({
      $and: [
        { "_id": { $in: userIds } },
        { "local.isActive": true },
        {
          $or: [
            { "username": { "$regex": new RegExp(keyword, "i") } },
            { "local.email": { "$regex": new RegExp(keyword, "i") } },
            { "facebook.email": { "$regex": new RegExp(keyword, "i") } },
            { "google.email": { "$regex": new RegExp(keyword, "i") } },
          ],
        },
      ],
    }, {
      _id: 1,
      username: 1,
      address: 1,
      avatar: 1,
    }).exec();
  },

  findByIds(userIds) {
    return this.find({
      "_id": { $in: userIds },
    }, {
      _id: 1,
      username: 1,
      address: 1,
      avatar: 1,
    }).exec();
  },

  updateUser(id, item) {
    return this.findByIdAndUpdate(id, item).exec();
  },

  verify(verifyToken) {
    return this.findOneAndUpdate(
      { "local.verifyToken": verifyToken },
      { "local.isActive": true, "local.verifyToken": null }
    ).exec();
  },

  removeById(id) {
    return this.findByIdAndRemove(id).exec();
  },
};

UserSchema.methods = {
  comparePassword(password) {
    return bcrypt.compare(password, this.local.password);
  },
};

export default mongoose.model("user", UserSchema);
