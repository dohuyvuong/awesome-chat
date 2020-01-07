import express from "express";
import { transErrors } from "../../lang/vi";
import { notificationService } from "../services";
import logger from "winston";

/**
 * Get notifications
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let getNotifications = async (req, res) => {
  logger.info("Get notifications");

  try {
    let currentUserId = req.user._id;
    let offset = +req.query.offset;
    let limit = +req.query.limit;

    offset = isNaN(offset) ? undefined : offset;
    limit = isNaN(limit) ? undefined : limit;

    let notifications = await notificationService.getNotifications(currentUserId, offset, limit);

    return res.status(200).send(notifications);
  } catch (error) {
    // Log error
    logger.error(error);

    return res.status(500).send(transErrors.server_error);
  }
};

/**
 * Mark notifications as read
 * @param {express.Request} req Request
 * @param {express.Response} res Response
 */
let markNotificationsAsRead = async (req, res) => {
  logger.info("Mork notification as read");

  try {
    let currentUserId = req.user._id;
    let targetUserIds = req.body.targetUserIds;

    let result = await notificationService.markNotificationsAsRead(currentUserId, targetUserIds);

    return res.status(200).send(result.n > 0 ? true : false);
  } catch (error) {
    // Log error
    logger.error(error);

    return res.status(500).send(transErrors.server_error);
  }
};

export const notificationController = {
  getNotifications,
  markNotificationsAsRead,
};
