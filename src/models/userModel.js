import mongoose from "mongoose";

let Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: String,
  gender: {type: String, default: "male"},
  phone: {type: Number, default: null},
  address: {type: String, default: null},
  avatar: {type: String, default: "avatar-default.jpg"},
  role: {type: String, default: "user"},
  local: {
    email: {type: String, trim: true},
    password: String,
    isActive: {type: Boolean, default: false},
    verifyToken: String,
  },
  facebook: {
    uid: String,
    token: String,
    email: {type: String, tim: true},
  },
  google: {
    uid: String,
    token: String,
    email: {type: String, tim: true},
  },
  createdAt: {type: Number, default: Date.now},
  updatedAt: {type: Number, default: null},
  deletedAt: {type: Number, default: null}
});

UserSchema.statics = {
  createNew(item) {
    return this.create(item);
  },

  findByEmail(email) {
    return this.findOne({"local.email": email}).exec();
  },

  findByVerifyToken(verifyToken) {
    return this.findOne({"local.verifyToken": verifyToken}).exec();
  },

  verify(verifyToken) {
    return this.findOneAndUpdate(
      { "local.verifyToken": verifyToken },
      { "local.isActive": true, "local.verifyToken": null }
    ).exec();
  },

  removeById(id) {
    return this.findByIdAndRemove(id).exec();
  }
};

module.exports = mongoose.model("user", UserSchema);
