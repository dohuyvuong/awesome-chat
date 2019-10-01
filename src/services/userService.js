import UserModel from "../models/userModel";
import { transErrors } from "../../lang/vi";
import bcrypt from "bcrypt";
import { app } from "../config/app";

/**
 * Update user information
 * @param {userId} id
 * @param {UserItem} item
 */
let updateUser = (id, item) => {
  return UserModel.updateUser(id, item);
};

/**
 * Update user password
 * @param {userId} id
 * @param {PasswordUpdatingData} passwordUpdatingData
 */
let updateUserPassword = async (id, passwordUpdatingData) => {
  let currentUser = await UserModel.findUserById(id);

  if (!currentUser) {
    throw transErrors.account_not_found;
  }

  let checkPassword = await currentUser.comparePassword(passwordUpdatingData.currentPassword);
  if (!checkPassword) {
    throw transErrors.password_incorrect;
  }

  let newLocalUserInfo = Object.assign(currentUser.local, {
    password: bcrypt.hashSync(passwordUpdatingData.newPassword, app.saltRounds)
  });

  let updatingUserItem = {
    local: newLocalUserInfo,
    updatedAt: Date.now(),
  };

  return UserModel.updateUser(id, updatingUserItem);
};

module.exports = {
  updateUser,
  updateUserPassword,
};
