import { UserModel } from "../models";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { transErrors, transSuccess, transMail } from "../../lang/vi";
import mailer from "../utils/mailer";
import { appConfigure } from "../config/app";
import logger from "winston";

/**
 * Register an account
 * @param {String} email Email
 * @param {String} gender Gender
 * @param {String} password Password
 * @param {String} protocol Protocol
 * @param {String} host Host
 */
let register = async (email, gender, password, protocol, host) => {
  logger.debug("Register account with email=%s, gender=%s, password=%s, protocol=%s, host=%s", email, gender, password, protocol, host);

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
      password: bcrypt.hashSync(password, appConfigure.saltRounds),
      verifyToken: uuid(),
    },
  };

  try {
    let user = await UserModel.createNew(userItem);

    try {
      // Send email
      let data = {
        email: email,
        verifyLink: `${protocol}://${host}/verify?verifyToken=${user.local.verifyToken}`,
      };
      await mailer.sendAccountActivationMail(email, data);
    } catch (error) {
      throw transMail.mail_active_registration_send_failed;
    }

    return transSuccess.userCreated(user.local.email);
  } catch (error) {
    if (error === transMail.mail_active_registration_send_failed) {
      throw error;
    }

    throw transErrors.account_create_failed;
  }
};

/**
 * Verify account
 * @param {String} verifyToken Token
 */
let verifyAccount = async (verifyToken) => {
  logger.debug("Verify account with verifyToken=%s", verifyToken);

  let userByVerifyToken = await UserModel.findByVerifyToken(verifyToken);

  if (!userByVerifyToken) {
    throw transErrors.account_active_token_invalid;
  }

  try {
    await UserModel.verify(verifyToken);

    return transSuccess.account_active_successfully;
  } catch (error) {
    throw transErrors.account_active_failed;
  }
};

export const authService = {
  register,
  verifyAccount,
};
