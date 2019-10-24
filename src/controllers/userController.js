import express from "express";
import multer from "multer";
import { appConfigure } from "../config/app";
import { transErrors, transSuccess } from "../../lang/vi";
import { v4 as uuidv4 } from "uuid";
import { userService } from "../services";
import fsExtra from "fs-extra";
import { validationResult } from "express-validator";

let avatarStorageLocation = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, appConfigure.avatarDirectory);
  },
  filename: (req, file, callback) => {
    let match = appConfigure.avatarType;
    if (!match.includes(file.mimetype)) {
      return callback(transErrors.avatar_type_not_supported, null);
    }

    let avatarFileName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
    callback(null, avatarFileName);
  },
});

let avatarUploadedFile = multer({
  storage: avatarStorageLocation,
  limits: { fileSize: appConfigure.avatarLimitedSize },
}).single("avatar");

/**
 * Update user avatar
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let updateAvatar = (req, res) => {
  avatarUploadedFile(req, res, async (error) => {
    if (error) {
      if (error.code && error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).send(transErrors.avatar_size_too_large);
      }
      if (error === transErrors.avatar_type_not_supported) {
        return res.status(400).send(error);
      }

      return res.status(500).send(transErrors.server_error);
    }

    try {
      let updatingUserItem = {
        avatar: req.file.filename,
        updatedAt: Date.now(),
      };

      // Update user by id, return user before updating
      let preUpdatedUser = await userService.updateUser(req.user._id, updatingUserItem);
      // Remove old avatar
      await fsExtra.remove(`${appConfigure.avatarDirectory}/${preUpdatedUser.avatar}`);

      let result = {
        message: transSuccess.avatar_updated_successfully,
        imageSrc: `/images/users/${req.file.filename}`,
      };

      return res.status(200).send(result);
    } catch (error) {
      return res.status(500).send(transErrors.server_error);
    }
  });
};

/**
 * Update user info
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let updateInfo = async (req, res) => {
  let validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    let errors = validationErrors.errors.map(error => `- ${error.msg}`).join("<br/>");

    return res.status(400).send(errors);
  }

  try {
    let updatingUserItem = Object.assign({ updatedAt: Date.now() }, req.body);

    // Update user by id
    await userService.updateUser(req.user._id, updatingUserItem);

    let result = {
      message: transSuccess.user_info_updated_successfully,
    };

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send(transErrors.server_error);
  }
};

/**
 * Update user password
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let updatePassword = async (req, res) => {
  let validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    let errors = validationErrors.errors.map(error => `- ${error.msg}`).join("<br/>");

    return res.status(400).send(errors);
  }

  try {
    // Update user by id
    await userService.updateUserPassword(req.user._id, req.body);

    let result = {
      message: transSuccess.user_password_updated_successfully,
    };

    return res.status(200).send(result);
  } catch (error) {
    if (error === transErrors.account_not_found || error === transErrors.password_incorrect) {
      return res.status(400).send(error);
    }

    return res.status(500).send(transErrors.server_error);
  }
};

export const userController = {
  updateAvatar,
  updateInfo,
  updatePassword,
};
