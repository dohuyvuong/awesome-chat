import UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { transErrors, transSuccess } from "../../lang/vi";

let saltRounds = 7;

let register = async (email, gender, password) => {
  let userByEmail = await UserModel.findByEmail(email);
  if (userByEmail) {
    if (userByEmail.deletedAt != null) {
      throw transErrors.account_email_is_exist_but_disabled;
    }

    if (!userByEmail.local.isActive) {
      throw transErrors.account_email_is_exist_but_not_active;
    }

    throw transErrors.account_email_is_exist;
  }

  let userItem = {
    username: email,
    gender: gender,
    local: {
      email: email,
      password: bcrypt.hashSync(password, saltRounds),
      verifyToken: uuid()
    }
  };

  let user;
  try {
    user = await UserModel.createNew(userItem);
  } catch (error) {
    throw error;
  }

  return transSuccess.userCreated(user.local.email);
};

module.exports = {
  register
};
