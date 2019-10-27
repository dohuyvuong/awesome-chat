import { UserModel, ContactModel, NotificationModel } from "../models";
import { NOTIFICATION_TYPES } from "../models/notificationModel";
import _ from "lodash";

/**
 * Search users to add new contact
 * @param {String} keyword Keyword to search new contact
 * @param {String} currentUserId Current user id
 */
let searchNewContact = async (keyword, currentUserId) => {
  let exceptedUserIds = [currentUserId];

  let contacts = await ContactModel.findByUserId(currentUserId);
  contacts.map(contact => {
    exceptedUserIds.push(contact.userId);
    exceptedUserIds.push(contact.contactId);
  });
  exceptedUserIds = _.uniq(exceptedUserIds);

  let users = await UserModel.findExceptedById(keyword, exceptedUserIds);

  return users;
}

/**
 * Add new contact
 * @param {String} currentUserId Current user id
 * @param {String} contactId Current user id
 */
let addNewContact = async (currentUserId, contactId) => {
  let existingContact = await ContactModel.findContact(currentUserId, contactId);
  if (existingContact) {
    return false;
  }

  // Create new contact
  let contactItem = {
    userId: currentUserId,
    contactId: contactId,
  };
  let newContact = await ContactModel.createNew(contactItem);

  // Create new notification
  let notificationItem = {
    senderId: currentUserId,
    receiverId: contactId,
    type: NOTIFICATION_TYPES.ADD_CONTACT,
  };
  await NotificationModel.createNew(notificationItem);

  return newContact ? true : false;
}

/**
 * Remove requesting contact
 * @param {String} currentUserId Current user id
 * @param {String} contactId Current user id
 */
let removeRequestingContact = async (currentUserId, contactId) => {
  let result = await ContactModel.removeRequestingContact(currentUserId, contactId);
  if (result.n === 0) {
    return false;
  }

  await NotificationModel.removeRequestingContactNotification(currentUserId, contactId);

  return true;
}

export const contactService = {
  searchNewContact,
  addNewContact,
  removeRequestingContact,
};
