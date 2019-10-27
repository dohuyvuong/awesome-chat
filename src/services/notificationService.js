import { NotificationModel, UserModel } from "../models";
import renderTemplate from "../utils/renderTemplate";
import { NOTIFICATION_TYPES } from "../models/notificationModel";

/**
 * Get notifications default 10 records
 * @param {String} currentUserId Current user id
 * @param {Number} limit Limit
 */
let getNotifications = async (currentUserId, limit = 10) => {
  let notifications = await NotificationModel.getByUserId(currentUserId, limit);

  let notificationContents = await Promise.all(notifications.map(async (notification) => {
    let sender = await UserModel.findUserById(notification.senderId);
    return getNotificationContent(notification, sender);
  }));
  let noOfUnreadNotification = notifications.filter(notification => !notification.isRead).length;

  return {
    notifications: notificationContents,
    noOfUnreadNotifications: noOfUnreadNotification,
  };
};

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
};
