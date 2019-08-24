import UserModel from "../models/userModel";

/**
 * Update user information
 * @param {userId} id
 * @param {UserItem} item
 */
let updateUser = (id, item) => {
  return UserModel.updateUser(id, item);
};

module.exports = {
  updateUser,
};
