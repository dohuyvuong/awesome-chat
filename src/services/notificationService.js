import { NotificationModel, UserModel } from "../models";
import renderTemplate from "../utils/renderTemplate";
import { NOTIFICATION_TYPES } from "../models/notificationModel";

/**
 * Get notifications default 10 records
 * @param {String} currentUserId Current user id
 * @param {Number} offset Offset default 0
 * @param {Number} limit Limit default 10
 */
let getNotifications = async (currentUserId, offset = 0, limit = 10) => {
  let notifications = await NotificationModel.getByUserId(currentUserId, offset, limit);

  return await Promise.all(notifications.map(async (notification) => {
    let sender = await UserModel.findUserById(notification.senderId);
    return getNotificationContent(notification, sender);
  }));
};

/**
 * Get number of unread notifications by userId
 * * @param {String} currentUserId Current user id
 */
let getNoOfUnreadNotifications = async (currentUserId) => {
  return await NotificationModel.getNoOfUnreadNotifications(currentUserId);
};

/**
 *
 * @param {String} currentUserId Current user id
 * @param {Array} targetUserIds Sender ids
 */
let markNotificationsAsRead = async (currentUserId, targetUserIds) => {
  return await NotificationModel.markNotificationsAsRead(currentUserId, targetUserIds);
};

/**
 * Get notification content for notification record
 * @param {NotificationModel} notification Notification
 * @param {UserModel} sender Sender
 */
let getNotificationContent = (notification, sender) => {
  if (notification.type === NOTIFICATION_TYPES.ADD_CONTACT) {
    return renderTemplate("addd_new_contact_notification.html", {
      user: {
        _id: sender._id,
        username: sender.username,
        avatar: sender.avatar,
      },
      notification: {
        isRead: notification.isRead,
      },
    });
  }
};

export const notificationService = {
  getNotifications,
  getNoOfUnreadNotifications,
  markNotificationsAsRead,
};
