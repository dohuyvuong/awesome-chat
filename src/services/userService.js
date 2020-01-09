import { UserModel } from "../models";
import { transErrors } from "../../lang/vi";
import bcrypt from "bcrypt";
import { appConfigure } from "../config/app";
import logger from "winston";

/**
 * Update user
 * @param {String} id User Id
 * @param {Object} item Updating User Object
 */
let updateUser = (id, item) => {
  logger.debug("Update user with id=%s, item=%o", id, item);

  return UserModel.updateUser(id, item);
};

/**
 * Update user password
 * @param {String} id User Id
 * @param {Object} passwordUpdatingData Password Data Object
 */
let updateUserPassword = async (id, passwordUpdatingData) => {
  logger.debug("Update user password with id=%s, passwordUpdatingData=%o", id, passwordUpdatingData);

  let currentUser = await UserModel.findUserById(id);

  if (!currentUser) {
    throw transErrors.account_not_found;
  }

  let checkPassword = await currentUser.comparePassword(passwordUpdatingData.currentPassword);
  if (!checkPassword) {
    throw transErrors.password_incorrect;
  }

  let newLocalUserInfo = Object.assign(currentUser.local, {
    password: bcrypt.hashSync(passwordUpdatingData.newPassword, appConfigure.saltRounds)
  });

  let updatingUserItem = {
    local: newLocalUserInfo,
    updatedAt: Date.now(),
  };

  return UserModel.updateUser(id, updatingUserItem);
};

export const userService = {
  updateUser,
  updateUserPassword,
};
